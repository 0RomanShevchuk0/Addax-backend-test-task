import { UserUpdateType } from "./../types/user/user-update"
import { UserCreateType } from "./../types/user/user-create"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { usersRepository } from "../repositories/users.repository"
import { PaginationResponseType } from "./../types/pagination"
import bcrypt from "bcrypt"
import { User } from "@prisma/client"

class UsersService {
  async getPaginatedUsers(params: QueryUsersRepositoryType): Promise<PaginationResponseType<User>> {
    return await usersRepository.query(params)
  }

  async getUserById(id: string): Promise<User | null> {
    const foundUser = await usersRepository.findOneById(id)
    if (!foundUser) {
      return null
    }

    return foundUser
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const foundUser = await usersRepository.findOneByEmail(email)
    if (!foundUser) {
      return null
    }

    return foundUser
  }

  async createUser(body: UserCreateType): Promise<User> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, passwordSalt)

    const createdUser = await usersRepository.createOne(body.email, passwordHash)
    return createdUser
  }

  async updateUser(id: string, body: UserUpdateType): Promise<User | null> {
    const updatedUser = await usersRepository.updateOne(id, body)

    if (!updatedUser) {
      return null
    }

    return updatedUser
  }

  async deleteUser(id: string) {
    const isDeleted = await usersRepository.deleteOneById(id)
    return isDeleted
  }

  async checkCredetrials(email: string, password: string): Promise<User | null> {
    const user = await usersRepository.findOneByEmail(email)
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) return null

    return user
  }
}

export const usersService = new UsersService()
