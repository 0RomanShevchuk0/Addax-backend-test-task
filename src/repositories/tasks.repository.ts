import { TaskModel } from "../models/task.model"
import { type ITask } from "../models/task.model"
import { type TaskUpdateType } from "../types/task/task-update"
import { type TaskCreateType } from "../types/task/task-create"
import { type QueryTasksRepositoryType } from "../types/task/task-request"
import { type PaginationResponseType } from "./../types/pagination"
import { calculateSkipValue, hasNextPrevPage } from "../utils/pagination.utils"
import { buildTasksFilterQuery } from "../utils/tasks-filter"

export const tasksRepository = {
  async query(params: QueryTasksRepositoryType): Promise<PaginationResponseType<ITask>> {
    const { pageSize, page: pageNumber } = params

    const filter = buildTasksFilterQuery(params)

    const skipValue = calculateSkipValue(pageNumber, pageSize)

    const [tasks, totalCount] = await Promise.all([
      TaskModel.find(filter).sort({ date: 1 }).skip(skipValue).limit(pageSize),
      TaskModel.countDocuments(filter),
    ])

    const { hasNextPage, hasPreviousPage } = hasNextPrevPage(pageNumber, pageSize, totalCount)

    const result: PaginationResponseType<ITask> = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      pageSize,
      page: pageNumber,
      items: tasks,
    }
    return result
  },

  async findOneById(taskId: string, userId: string): Promise<ITask | null> {
    return TaskModel.findOne({ taskId, userId }).exec()
  },

  async createOne(newTask: TaskCreateType): Promise<ITask> {
    return await TaskModel.create(newTask)
  },

  async updateOne(
    taskId: string,
    userId: string,
    updatedTask: TaskUpdateType
  ): Promise<ITask | null> {
    return TaskModel.findOneAndUpdate(
      { id: taskId, userId },
      { $set: updatedTask },
      { new: true }
    ).exec()
  },

  async deleteOne(taskId: string, userId: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({ id: taskId, userId })
    return result.deletedCount === 1
  },
}
