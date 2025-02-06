import { UserUpdateType } from "./../types/user/user-update"
import { UserCreateType } from "./../types/user/user-create"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { usersRepository } from "../repositories/users.repository"
import { UserViewType } from "../types/user/user-view"
import { PaginationResponseType } from "./../types/pagination"
import { v4 as uuidv4 } from "uuid"
import { UserModel } from "../models/user.model"
import { getUserViewModel } from "../mappers/user.mapper"
import bcrypt from "bcrypt"

export const usersService = {
  async getPaginatedUsers(
    params: QueryUsersRepositoryType
  ): Promise<PaginationResponseType<UserViewType>> {
    const userRespose = await usersRepository.query(params)

    return {
      hasNextPage: userRespose.hasNextPage,
      hasPreviousPage: userRespose.hasPreviousPage,
      page: userRespose.page,
      pageSize: userRespose.pageSize,
      totalCount: userRespose.totalCount,
      items: userRespose.items.map(getUserViewModel),
    }
  },

  async getUserById(id: string): Promise<UserViewType | null> {
    const foundUser = await usersRepository.findOneById(id)
    if (!foundUser) {
      return null
    }

    return getUserViewModel(foundUser)
  },

  async createUser(body: UserCreateType): Promise<UserViewType> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, passwordSalt)

    const newUser = new UserModel({
      id: uuidv4(),
      email: body.email,
      passwordHash: passwordHash,
    })

    const createdUser = await usersRepository.createOne(newUser)

    return getUserViewModel(createdUser)
  },

  async updateUser(id: string, body: UserUpdateType): Promise<UserViewType | null> {
    const updatedUser = await usersRepository.updateOne(id, body)

    if (!updatedUser) {
      return null
    }

    return getUserViewModel(updatedUser)
  },

  async deleteUser(id: string) {
    const isDeleted = await usersRepository.deleteOneById(id)
    return isDeleted
  },
}
