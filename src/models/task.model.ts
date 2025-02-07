import mongoose, { Document, Schema } from "mongoose"

export interface ITask extends Document {
  id: string
  userId: string
  name: string
  date: Date
  notes?: string
  color?: string
}

const TaskSchema = new Schema<ITask>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, required: false },
  color: { type: String, required: false },
})

export const TaskModel = mongoose.model<ITask>("Tasks", TaskSchema)
