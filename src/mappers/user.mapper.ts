import { User } from "@prisma/client"
import { UserViewType } from "../types/user/user-view"

export const getUserViewModel = (dbUser: User): UserViewType => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || null,
  }
}
