import { type FilterQuery } from "mongoose"
import { type ITask } from "../models/task.model"
import { type QueryTasksRepositoryType } from "../types/task/task-request.types"

export const buildTasksFilterQuery = (params: QueryTasksRepositoryType): FilterQuery<ITask> => {
  const { name, startDate, endDate } = params
  const filter: FilterQuery<ITask> = {}

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
