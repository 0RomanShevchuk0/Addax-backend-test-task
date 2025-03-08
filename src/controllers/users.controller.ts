import { Request, Response } from "express"
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/request.types"
import { QueryUsersRouterType, URIParamUserIdType } from "../types/user/user-request"
import { PaginationResponseType } from "../types/pagination"
import { UserViewType } from "../types/user/user-view"
import { usersService } from "../services/users.service"
import { UserCreateType } from "../types/user/user-create"
import { Result, ValidationError } from "express-validator"
import { UserUpdateType } from "../types/user/user-update"
import { mapUserToView } from "../mappers/user.mapper"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { prismaErrorsHandler } from "../utils/prisma-error-handler"
import { requestContextService } from "../services/request-context.service"
import { imageMimeTypes } from "../constants/mime-types"
import { deleteCacheData, getCachedData, setCacheData } from "../utils/cache.utils"

class UsersController {
  async getAll(
    req: RequestWithQuery<QueryUsersRouterType>,
    res: Response<PaginationResponseType<UserViewType>>
  ) {
    const queryPrams = req.query

    const page = queryPrams.page ? +queryPrams.page : 1
    const pageSize = queryPrams.pageSize ? +queryPrams.pageSize : 10

    const paginatedResponse = await usersService.getPaginatedUsers({
      email: queryPrams.email,
      page,
      pageSize,
    })

    res.json({
      hasNextPage: paginatedResponse.hasNextPage,
      hasPreviousPage: paginatedResponse.hasPreviousPage,
      page: paginatedResponse.page,
      pageSize: paginatedResponse.pageSize,
      totalCount: paginatedResponse.totalCount,
      items: paginatedResponse.items.map(mapUserToView),
    })
  }

  async getById(req: RequestWithParams<URIParamUserIdType>, res: Response<UserViewType>) {
    const userId = req.params.id

    const cacheKey = `user:${userId}`
    const cachedUser = await getCachedData(cacheKey)
    if (cachedUser) {
      return res.send(cachedUser)
    }

    const foundUser = await usersService.getUserById(userId)
    if (!foundUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    await setCacheData(cacheKey, mapUserToView(foundUser), 600)

    res.json(mapUserToView(foundUser))
  }

  async createOne(
    req: RequestWithBody<UserCreateType>,
    res: Response<UserViewType | Result<ValidationError> | { message: string }>
  ) {
    try {
      const createdUser = await usersService.createUser(req.body)
      res.status(HTTP_STATUSES.CREATED_201).json(mapUserToView(createdUser))
    } catch (error) {
      prismaErrorsHandler(error, res)
    }
  }

  async updateOne(
    req: RequestWithParamsAndBody<URIParamUserIdType, UserUpdateType>,
    res: Response<UserViewType | Result<ValidationError>>
  ) {
    const userId = req.params.id

    const updatedUser = await usersService.updateUser(userId, req.body)

    if (!updatedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const cacheKey = `user:${userId}`
    deleteCacheData(cacheKey)

    res.status(HTTP_STATUSES.OK_200).json(mapUserToView(updatedUser))
  }

  async deleteOne(req: RequestWithParams<URIParamUserIdType>, res: Response) {
    const userId = req.params.id
    const isDeleted = await usersService.deleteUser(userId)
    const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

    if (isDeleted) {
      const cacheKey = `user:${userId}`
      deleteCacheData(cacheKey)
    }

    res.sendStatus(resultStatus)
  }

  async uploadProfilePhoto(req: Request, res: Response) {
    const { user } = requestContextService.getRequestContext()

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const file = req.file
    if (!file) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message: "No file uploaded" })
    }

    if (!imageMimeTypes.includes(file.mimetype)) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message: "Invalid file type" })
    }

    const avatarUrl = await usersService.uploadAvatar(user, file)

    if (!avatarUrl) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const cacheKey = `user:${user.id}`
    deleteCacheData(cacheKey)

    res.status(HTTP_STATUSES.OK_200).json({ avatarUrl })
  }
}

export const userController = new UsersController()
