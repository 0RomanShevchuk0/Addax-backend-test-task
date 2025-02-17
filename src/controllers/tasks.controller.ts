import { Response } from "express"
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/request.types"
import { QueryTasksRouterType, URIParamTaskIdType } from "../types/task/task-request"
import { PaginationResponseType } from "../types/pagination"
import { TaskViewType } from "../types/task/task-view"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { tasksService } from "../services/tasks.service"
import { TaskCreateType } from "../types/task/task-create"
import { Result, ValidationError } from "express-validator"
import { TaskUpdateType } from "../types/task/task-update"
import { getTaskViewModel } from "../mappers/task.mapper"
import { requestContextService } from "../services/request-context.service"

class TasksController {
  async getAll(
    req: RequestWithQuery<QueryTasksRouterType>,
    res: Response<PaginationResponseType<TaskViewType>>
  ) {
    const queryPrams = req.query

    const page = queryPrams.page ? +queryPrams.page : 1
    const pageSize = queryPrams.pageSize ? +queryPrams.pageSize : 10

    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const tasksResponse = await tasksService.getPaginatedTasks({
      userId: user.id,
      name: queryPrams.name,
      startDate: queryPrams.startDate,
      endDate: queryPrams.endDate,
      page,
      pageSize,
    })

    res.json({
      hasNextPage: tasksResponse.hasNextPage,
      hasPreviousPage: tasksResponse.hasPreviousPage,
      page: tasksResponse.page,
      pageSize: tasksResponse.pageSize,
      totalCount: tasksResponse.totalCount,
      items: tasksResponse.items.map(getTaskViewModel),
    })
  }

  async getOneById(req: RequestWithParams<URIParamTaskIdType>, res: Response<TaskViewType>) {
    const taskId = req.params.id

    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const foundTask = await tasksService.getTaskById(taskId, user.id)
    if (!foundTask) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.json(getTaskViewModel(foundTask))
  }

  async createOne(
    req: RequestWithBody<TaskCreateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) {
    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const createdTask = await tasksService.createTask(user.id, req.body)
    res.status(HTTP_STATUSES.CREATED_201).json(getTaskViewModel(createdTask))
  }

  async updateOne(
    req: RequestWithParamsAndBody<URIParamTaskIdType, TaskUpdateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) {
    const taskId = req.params.id

    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const updatedTask = await tasksService.updateTask(taskId, user.id, req.body)

    if (!updatedTask) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).json(getTaskViewModel(updatedTask))
  }

  async deleteOne(req: RequestWithParams<URIParamTaskIdType>, res: Response) {
    const taskId = req.params.id

    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const isDeleted = await tasksService.deleteTask(taskId, user.id)
    const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

    res.sendStatus(resultStatus)
  }
}

export const tasksController = new TasksController()
