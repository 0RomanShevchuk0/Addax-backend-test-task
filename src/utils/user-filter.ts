import { type FilterQuery } from "mongoose"
import { QueryUsersRepositoryType } from "../types/user/user-request"
import { IUser } from "../models/user.model"

export const buildUsersFilterQuery = (params: QueryUsersRepositoryType): FilterQuery<IUser> => {
  const { email } = params
  const filter: FilterQuery<IUser> = {}

  if (email) {
    filter.email = { $regex: email, $options: "i" }
  }

  return filter
}
