import { Task } from "@prisma/client"
import { TaskViewType } from "../types/task/task-view"

export const mapTaskToView = (dbTask: Task): TaskViewType => {
  return {
    id: dbTask.id,
    name: dbTask.name,
    date: dbTask.date.toISOString().split("T")[0],
    notes: dbTask.notes,
    color: dbTask.color,
  }
}
