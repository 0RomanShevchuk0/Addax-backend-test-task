import { type FilterQuery } from "mongoose"
import { type ITask } from "../models/task.model"
import { type QueryTasksRepositoryType } from "../types/task/task-request"

export const buildTasksFilterQuery = (params: QueryTasksRepositoryType): FilterQuery<ITask> => {
  const { name, startDate, endDate, userId } = params
  const filter: FilterQuery<ITask> = { userId }

  if (name) {
    filter.name = { $regex: name, $options: "i" }
  }

  if (startDate || endDate) {
    filter.date = {}
    if (startDate) {
      filter.date.$gte = startDate
    }
    if (endDate) {
      filter.date.$lte = endDate
    }
  }

  return filter
}
