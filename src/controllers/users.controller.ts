import { Response } from "express"
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
import { getUserViewModel } from "../mappers/user.mapper"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { createUserErrorHandler } from "../utils/create-user-error-handler"

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
      items: paginatedResponse.items.map(getUserViewModel),
    })
  }

  async getById(req: RequestWithParams<URIParamUserIdType>, res: Response<UserViewType>) {
    const userId = req.params.id

    const foundUser = await usersService.getUserById(userId)
    if (!foundUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.json(getUserViewModel(foundUser))
  }

  async createOne(
    req: RequestWithBody<UserCreateType>,
    res: Response<UserViewType | Result<ValidationError> | { message: string }>
  ) {
    try {
      const createdUser = await usersService.createUser(req.body)
      res.status(HTTP_STATUSES.CREATED_201).json(getUserViewModel(createdUser))
    } catch (error) {
      createUserErrorHandler(error, res)
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

    res.status(HTTP_STATUSES.OK_200).json(getUserViewModel(updatedUser))
  }

  async deleteOne(req: RequestWithParams<URIParamUserIdType>, res: Response) {
    const userId = req.params.id
    const isDeleted = await usersService.deleteUser(userId)
    const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

    res.sendStatus(resultStatus)
  }
}

export const userController = new UsersController()
