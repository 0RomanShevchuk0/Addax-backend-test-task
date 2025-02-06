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
import { taskService } from "../services/tasks.service"
import { TaskCreateType } from "../types/task/task-create"
import { Result, ValidationError } from "express-validator"
import { TaskUpdateType } from "../types/task/task-update"

class TasksController {
  async getAll(
    req: RequestWithQuery<QueryTasksRouterType>,
    res: Response<PaginationResponseType<TaskViewType>>
  ) {
    const queryPrams = req.query

    const page = queryPrams.page ? +queryPrams.page : 1
    const pageSize = queryPrams.pageSize ? +queryPrams.pageSize : 10

    try {
      const tasksResponse = await taskService.getPaginatedTasks({
        name: queryPrams.name,
        startDate: queryPrams.startDate,
        endDate: queryPrams.endDate,
        page,
        pageSize,
      })

      res.json(tasksResponse)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
  }

  async getOneById(req: RequestWithParams<URIParamTaskIdType>, res: Response<TaskViewType>) {
    const taskId = req.params.id

    try {
      const foundTask = await taskService.getTaskById(taskId)
      if (!foundTask) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.json(foundTask)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
  }

  async createOne(
    req: RequestWithBody<TaskCreateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) {
    try {
      const createdTask = await taskService.createTask(req.body)
      res.status(HTTP_STATUSES.CREATED_201).json(createdTask)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }

  async updateOne(
    req: RequestWithParamsAndBody<URIParamTaskIdType, TaskUpdateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) {
    const taskId = req.params.id
    try {
      const updatedTask = await taskService.updateTask(taskId, req.body)

      if (!updatedTask) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.status(HTTP_STATUSES.OK_200).json(updatedTask)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }

  async deleteOne(req: RequestWithParams<URIParamTaskIdType>, res: Response) {
    const taskId = req.params.id
    try {
      const isDeleted = await taskService.deleteTask(taskId)
      const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

      res.sendStatus(resultStatus)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
}

export const tasksController = new TasksController()
