import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  id: string
  email: string
  passwordHash: string
  name: string
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: false },
})

export const UserModel = mongoose.model<IUser>("Users", UserSchema)
