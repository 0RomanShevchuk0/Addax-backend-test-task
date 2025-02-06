import { IUser } from "../models/user.model"
import { UserViewType } from "../types/user/user-view"

export const getUserViewModel = (dbUser: IUser): UserViewType => {
  return {
    id: dbUser.id,
    email: dbUser.email,
  }
}
