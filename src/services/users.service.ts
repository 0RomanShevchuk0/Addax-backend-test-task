import { IUser } from "./../models/user.model"
import { UserUpdateType } from "./../types/user/user-update"
import { UserCreateType } from "./../types/user/user-create"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { usersRepository } from "../repositories/users.repository"
import { PaginationResponseType } from "./../types/pagination"
import { v4 as uuidv4 } from "uuid"
import { UserModel } from "../models/user.model"
import bcrypt from "bcrypt"

export const usersService = {
  async getPaginatedUsers(
    params: QueryUsersRepositoryType
  ): Promise<PaginationResponseType<IUser>> {
    return await usersRepository.query(params)
  },

  async getUserById(id: string): Promise<IUser | null> {
    const foundUser = await usersRepository.findOneById(id)
    if (!foundUser) {
      return null
    }

    return foundUser
  },

  async getUserByEmail(email: string): Promise<IUser | null> {
    const foundUser = await usersRepository.findOneById(email)
    if (!foundUser) {
      return null
    }

    return foundUser
  },

  async createUser(body: UserCreateType): Promise<IUser> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, passwordSalt)

    const newUser = new UserModel({
      id: uuidv4(),
      email: body.email,
      passwordHash: passwordHash,
    })

    const createdUser = await usersRepository.createOne(newUser)

    return createdUser
  },

  async updateUser(id: string, body: UserUpdateType): Promise<IUser | null> {
    const updatedUser = await usersRepository.updateOne(id, body)

    if (!updatedUser) {
      return null
    }

    return updatedUser
  },

  async deleteUser(id: string) {
    const isDeleted = await usersRepository.deleteOneById(id)
    return isDeleted
  },

  async checkCredetrials(email: string, password: string): Promise<IUser | null> {
    const user = await usersRepository.findOneByEmail(email)
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) return null

    return user
  },
}
