import { body } from "express-validator"
import { UserUpdateType } from "./../types/user/user-update"
import { UserCreateType } from "./../types/user/user-create"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { PaginationResponseType } from "./../types/pagination"
import bcrypt from "bcrypt"
import { Prisma, User } from "@prisma/client"
import { usersRepository } from "../repositories/users.repository"
import s3 from "../config/s3Client"
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { s3Service } from "./s3.service"

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

    const newUser: Prisma.UserUncheckedCreateInput = {
      email: body.email,
      passwordHash,
    }

    const createdUser = await usersRepository.createOne(newUser)
    return createdUser
  }

  async updateUser(id: string, body: UserUpdateType): Promise<User | null> {
    const updatedUser: Prisma.UserUncheckedUpdateInput = {
      email: body.email,
      name: body.name,
    }

    const updatedUserResponse = await usersRepository.updateOne(id, updatedUser)

    if (!updatedUserResponse) {
      return null
    }

    return updatedUserResponse
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

  async uploadAvatar(user: User, file: Express.Multer.File): Promise<string | null> {
    const bucketName = "addax-test-task"
    const fileKey = `avatars/${user.id}/${Date.now()}_${file.originalname}`

    const avatarUrl = await s3Service.uploadFile(bucketName, fileKey, file)

    if (!avatarUrl) {
      return null
    }

    if (user.avatarUrl) {
      const currentAvatarFileKey = new URL(user.avatarUrl).pathname.slice(1)
      const result = await s3Service.deleteFile(bucketName, currentAvatarFileKey)
      console.log("UsersServiceuploadAvatar result:", result)
    }

    const updatedUser = await usersRepository.updateOne(user.id, { avatarUrl })
    return updatedUser?.avatarUrl || null
  }
}

export const usersService = new UsersService()
