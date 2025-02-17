import { QueryTasksRepositoryType } from "../types/task/task-request"
import { TaskUpdateType } from "../types/task/task-update"
import { TaskCreateType } from "../types/task/task-create"
import { tasksRepository } from "../repositories/tasks.repository"
import { PaginationResponseType } from "../types/pagination"
import { Task } from "@prisma/client"

class TaskService {
  async getPaginatedTasks(params: QueryTasksRepositoryType): Promise<PaginationResponseType<Task>> {
    return tasksRepository.query(params)
  }

  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    const foundTask = await tasksRepository.findOneById(taskId, userId)

    if (!foundTask) {
      return null
    }

    return foundTask
  }

  async createTask(userId: string, body: TaskCreateType): Promise<Task> {
    const createdTask = await tasksRepository.createOne(userId, body)

    return createdTask
  }

  async updateTask(taskId: string, userId: string, body: TaskUpdateType): Promise<Task | null> {
    const updatedTask = await tasksRepository.updateOne(taskId, userId, body)

    if (!updatedTask) {
      return null
    }

    return updatedTask
  }

  async deleteTask(taskId: string, userId: string) {
    const isDeleted = await tasksRepository.deleteOne(taskId, userId)
    return isDeleted
  }
}

export const tasksService = new TaskService()
