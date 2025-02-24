import { UserUpdateType } from "./../types/user/user-update"
import { QueryUsersRepositoryType } from "./../types/user/user-request"
import { calculateSkipValue, hasNextPrevPage } from "../utils/pagination.utils"
import { PaginationResponseType } from "./../types/pagination"
import prisma from "../config/prisma.client"
import { Prisma, User } from "@prisma/client"

class UsersRepository {
  async query(params: QueryUsersRepositoryType): Promise<PaginationResponseType<User>> {
    const { pageSize, page: pageNumber } = params

    const skipValue = calculateSkipValue(pageNumber, pageSize)

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: skipValue,
        take: pageSize,
        where: { email: { mode: "insensitive", contains: params.email } },
      }),
      prisma.user.count(),
    ])

    const { hasNextPage, hasPreviousPage } = hasNextPrevPage(pageNumber, pageSize, totalCount)

    const result: PaginationResponseType<User> = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      pageSize,
      page: pageNumber,
      items: users,
    }
    return result
  }

  async findOneById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id } })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email } })
  }

  async createOne(newUser: Prisma.UserUncheckedCreateInput): Promise<User> {
    return prisma.user.create({ data: newUser })
  }

  async updateOne(id: string, updatedUser: Prisma.UserUncheckedUpdateInput): Promise<User | null> {
    return await prisma.user.update({ where: { id }, data: updatedUser })
  }

  async deleteOneById(id: string): Promise<boolean> {
    const result = await prisma.user.delete({ where: { id } })
    return !!result.id
  }
}

export const usersRepository = new UsersRepository()
