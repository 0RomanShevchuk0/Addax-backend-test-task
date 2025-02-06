import { ITask } from "../models/task.model"
import { TaskViewType } from "../types/task/task-view"

export const getTaskViewModel = (dbTask: ITask): TaskViewType => {
  return {
    id: dbTask.id,
    name: dbTask.name,
    date: dbTask.date.toISOString().split("T")[0],
    notes: dbTask.notes,
    color: dbTask.color,
  }
}
