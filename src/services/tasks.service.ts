import { QueryTasksRepositoryType } from "../types/task/task-request"
import { TaskUpdateType } from "../types/task/task-update"
import { TaskCreateType } from "../types/task/task-create"
import { TaskModel } from "../models/task.model"
import { v4 as uuidv4 } from "uuid"
import { tasksRepository } from "../repositories/tasks.repository"
import { PaginationResponseType } from "../types/pagination"
import { TaskViewType } from "../types/task/task-view"
import { getTaskViewModel } from "../mappers/task.mapper"

export const taskService = {
  async getPaginatedTasks(
    params: QueryTasksRepositoryType
  ): Promise<PaginationResponseType<TaskViewType>> {
    const tasksRespose = await tasksRepository.query(params)

    return {
      hasNextPage: tasksRespose.hasNextPage,
      hasPreviousPage: tasksRespose.hasPreviousPage,
      page: tasksRespose.page,
      pageSize: tasksRespose.pageSize,
      totalCount: tasksRespose.totalCount,
      items: tasksRespose.items.map(getTaskViewModel),
    }
  },

  async getTaskById(taskId: string): Promise<TaskViewType | null> {
    const foundTask = await tasksRepository.findOneById(taskId)
    if (!foundTask) {
      return null
    }

    return getTaskViewModel(foundTask)
  },

  async createTask(body: TaskCreateType): Promise<TaskViewType> {
    const newTask = new TaskModel({
      id: uuidv4(),
      name: body.name,
      date: body.date,
      notes: body.notes,
      color: body.color,
    })

    const createdTask = await tasksRepository.createOne(newTask)

    return getTaskViewModel(createdTask)
  },

  async updateTask(taskId: string, body: TaskUpdateType): Promise<TaskViewType | null> {
    const updatedTask = await tasksRepository.updateOne(taskId, body)

    if (!updatedTask) {
      return null
    }

    return getTaskViewModel(updatedTask)
  },

  async deleteTask(taskId: string) {
    const isDeleted = await tasksRepository.deleteOne(taskId)
    return isDeleted
  },
}
