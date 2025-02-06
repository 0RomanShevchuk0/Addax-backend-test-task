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
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { UserCreateType } from "../types/user/user-create"
import { Result, ValidationError } from "express-validator"
import { UserUpdateType } from "../types/user/user-update"

class UsersController {
  async getAll(
    req: RequestWithQuery<QueryUsersRouterType>,
    res: Response<PaginationResponseType<UserViewType>>
  ) {
    const queryPrams = req.query

    const page = queryPrams.page ? +queryPrams.page : 1
    const pageSize = queryPrams.pageSize ? +queryPrams.pageSize : 10

    try {
      const usersResponse = await usersService.getPaginatedUsers({
        email: queryPrams.email,
        page,
        pageSize,
      })

      res.json(usersResponse)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
  }

  async getById(req: RequestWithParams<URIParamUserIdType>, res: Response<UserViewType>) {
    const userId = req.params.id

    try {
      const foundUser = await usersService.getUserById(userId)
      if (!foundUser) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.json(foundUser)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
  }

  async createOne(
    req: RequestWithBody<UserCreateType>,
    res: Response<UserViewType | Result<ValidationError>>
  ) {
    try {
      const createdUser = await usersService.createUser(req.body)
      res.status(HTTP_STATUSES.CREATED_201).json(createdUser)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }

  async updateOne(
    req: RequestWithParamsAndBody<URIParamUserIdType, UserUpdateType>,
    res: Response<UserViewType | Result<ValidationError>>
  ) {
    const userId = req.params.id
    try {
      const updatedUser = await usersService.updateUser(userId, req.body)

      if (!updatedUser) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.status(HTTP_STATUSES.OK_200).json(updatedUser)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }

  async deleteOne(req: RequestWithParams<URIParamUserIdType>, res: Response) {
    const userId = req.params.id
    try {
      const isDeleted = await usersService.deleteUser(userId)
      const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

      res.sendStatus(resultStatus)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
}

export const userController = new UsersController()
