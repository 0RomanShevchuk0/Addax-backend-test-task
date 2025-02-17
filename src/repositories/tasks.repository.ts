import { type TaskUpdateType } from "../types/task/task-update"
import { type TaskCreateType } from "../types/task/task-create"
import { type QueryTasksRepositoryType } from "../types/task/task-request"
import { type PaginationResponseType } from "./../types/pagination"
import { calculateSkipValue, hasNextPrevPage } from "../utils/pagination.utils"
import { Task } from "@prisma/client"
import prisma from "../config/prisma.client"

class TasksRepository {
  async query(params: QueryTasksRepositoryType): Promise<PaginationResponseType<Task>> {
    const { pageSize, page: pageNumber } = params

    const skipValue = calculateSkipValue(pageNumber, pageSize)

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        skip: skipValue,
        take: pageSize,
        where: {
          name: {
            mode: "insensitive",
            contains: params.name,
          },
          date: {
            ...(params.startDate && { gte: new Date(params.startDate) }),
            ...(params.endDate && { lte: new Date(params.endDate) }),
          },
        },
      }),
      prisma.task.count(),
    ])

    const { hasNextPage, hasPreviousPage } = hasNextPrevPage(pageNumber, pageSize, totalCount)

    const result: PaginationResponseType<Task> = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      pageSize,
      page: pageNumber,
      items: tasks,
    }
    return result
  }

  async findOneById(taskId: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id: taskId, userId } })
  }

  async createOne(userId: string, body: TaskCreateType): Promise<Task> {
    return prisma.task.create({
      data: {
        name: body.name,
        date: body.date,
        notes: body.notes,
        color: body.color,
        userId: userId,
      },
    })
  }

  async updateOne(
    taskId: string,
    userId: string,
    updatedTask: TaskUpdateType
  ): Promise<Task | null> {
    return prisma.task.update({
      where: { id: taskId, userId },
      data: updatedTask,
    })
  }

  async deleteOne(taskId: string, userId: string): Promise<boolean> {
    const result = await prisma.task.delete({ where: { id: taskId, userId } })
    return !!result.id
  }
}

export const tasksRepository = new TasksRepository()
