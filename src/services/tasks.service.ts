import { QueryTasksRepositoryType } from "../types/task/task-request"
import { TaskUpdateType } from "../types/task/task-update"
import { TaskCreateType } from "../types/task/task-create"
import { ITask, TaskModel } from "../models/task.model"
import { v4 as uuidv4 } from "uuid"
import { tasksRepository } from "../repositories/tasks.repository"
import { PaginationResponseType } from "../types/pagination"

export const taskService = {
  async getPaginatedTasks(
    params: QueryTasksRepositoryType
  ): Promise<PaginationResponseType<ITask>> {
    return tasksRepository.query(params)
  },

  async getTaskById(taskId: string, userId: string): Promise<ITask | null> {
    const foundTask = await tasksRepository.findOneById(taskId, userId)
		
    if (!foundTask) {
      return null
    }

    return foundTask
  },

  async createTask(userId: string, body: TaskCreateType): Promise<ITask> {
    const newTask = new TaskModel({
      id: uuidv4(),
      userId,
      name: body.name,
      date: body.date,
      notes: body.notes,
      color: body.color,
    })

    const createdTask = await tasksRepository.createOne(newTask)

    return createdTask
  },

  async updateTask(taskId: string, userId: string, body: TaskUpdateType): Promise<ITask | null> {
    const updatedTask = await tasksRepository.updateOne(taskId, userId, body)

    if (!updatedTask) {
      return null
    }

    return updatedTask
  },

  async deleteTask(taskId: string, userId: string) {
    const isDeleted = await tasksRepository.deleteOne(taskId, userId)
    return isDeleted
  },
}
