import { UserCreateType } from "./../types/user/user-create"
import { UserUpdateType } from "./../types/user/user-update"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { calculateSkipValue, hasNextPrevPage } from "../utils/pagination.utils"
import { buildTasksFilterQuery } from "../utils/tasks-filter"
import { PaginationResponseType } from "./../types/pagination"
import { IUser, UserModel } from "../models/user.model"

export const usersRepository = {
  async query(params: QueryUsersRepositoryType): Promise<PaginationResponseType<IUser>> {
    const { pageSize, page: pageNumber } = params

    const filter = buildTasksFilterQuery(params)

    const skipValue = calculateSkipValue(pageNumber, pageSize)

    const [users, totalCount] = await Promise.all([
      UserModel.find(filter).sort().skip(skipValue).limit(pageSize),
      UserModel.countDocuments(filter),
    ])

    const { hasNextPage, hasPreviousPage } = hasNextPrevPage(pageNumber, pageSize, totalCount)

    const result: PaginationResponseType<IUser> = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      pageSize,
      page: pageNumber,
      items: users,
    }
    return result
  },

  async findOneById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ id }).exec()
  },

  async createOne(newUser: IUser): Promise<IUser> {
    return await UserModel.create(newUser)
  },

  async updateOne(id: string, updatedUser: UserUpdateType): Promise<IUser | null> {
    return UserModel.findOneAndUpdate({ id }, { $set: updatedUser }, { new: true }).exec()
  },

  async deleteOneById(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id })
    return result.deletedCount === 1
  },
}
