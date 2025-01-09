import { HTTP_STATUSES } from "../constants/httpStatuses"
import { Response, Router } from "express"
import { body, Result, ValidationError, checkExact } from "express-validator"
import { inputValidationMiddlevare } from "../middlewares/input-validation-middlevare"
import { tasksRepository } from "../repositories/tasks.repository"
import { ITask, TaskModel } from "../models/task.model"
import { v4 as uuidv4 } from "uuid"
import { type TaskViewType } from "../types/task/task-view"
import { type TaskCreateType } from "../types/task/task-create"
import { type TaskUpdateType } from "../types/task/task-update"
import { type PaginationResponseType } from "./../types/pagination"
import {
  type RequestWithBody,
  type RequestWithParams,
  type RequestWithParamsAndBody,
  type RequestWithQuery,
} from "../types/request.types"
import {
  type QueryTasksRouterType,
  type URIParamTaskIdType,
} from "../types/task/task-request.types"

const getTaskViewModel = (dbTask: ITask): TaskViewType => {
  return {
    id: dbTask.id,
    name: dbTask.name,
    date: dbTask.date.toISOString().split("T")[0],
    notes: dbTask.notes,
    color: dbTask.color,
  }
}

const taskValidation = checkExact(
  [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3, max: 30 })
      .withMessage("Name length should be between 3 and 30 characters"),

    body("date").isDate().withMessage("Start date must be in YYYY-MM-DD format"),
    body("notes").optional().isString().withMessage("Notes must be a string if provided"),
    body("color").optional().isString().withMessage("Color must be a string if provided"),
  ],
  { message: "Unknown fields specified" }
)

export const tasksRouter = Router()

tasksRouter.get(
  "/",
  async (
    req: RequestWithQuery<QueryTasksRouterType>,
    res: Response<PaginationResponseType<TaskViewType>>
  ) => {
    const queryPrams = req.query

    const page = queryPrams.page ? +queryPrams.page : 1
    const pageSize = queryPrams.pageSize ? +queryPrams.pageSize : 10

    try {
      const tasksRespose = await tasksRepository.findTasks({
        name: queryPrams.name,
        startDate: queryPrams.startDate,
        endDate: queryPrams.endDate,
        page,
        pageSize,
      })

      const result: PaginationResponseType<TaskViewType> = {
        hasNextPage: tasksRespose.hasNextPage,
        hasPreviousPage: tasksRespose.hasPreviousPage,
        page: tasksRespose.page,
        pageSize: tasksRespose.pageSize,
        totalCount: tasksRespose.totalCount,
        items: tasksRespose.items.map(getTaskViewModel),
      }
      res.json(result)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
  }
)

tasksRouter.get(
  "/:id",
  async (req: RequestWithParams<URIParamTaskIdType>, res: Response<TaskViewType>) => {
    const taskId = req.params.id

    try {
      const foundTask = await tasksRepository.findTaskById(taskId)
      if (!foundTask) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }
      res.json(getTaskViewModel(foundTask))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
  }
)

tasksRouter.post(
  "/",
  taskValidation,
  inputValidationMiddlevare,
  async (
    req: RequestWithBody<TaskCreateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) => {
    try {
      const newTask = new TaskModel({
        id: uuidv4(),
        name: req.body.name,
        date: req.body.date,
        notes: req.body.notes,
        color: req.body.color,
      })

      const createdTask = await tasksRepository.createTask(newTask)

      res.status(HTTP_STATUSES.CREATED_201).json(getTaskViewModel(createdTask))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
)

tasksRouter.patch(
  "/:id",
  taskValidation,
  inputValidationMiddlevare,
  async (
    req: RequestWithParamsAndBody<URIParamTaskIdType, TaskUpdateType>,
    res: Response<TaskViewType | Result<ValidationError>>
  ) => {
    const taskId = req.params.id
    try {
      const updatedTask = await tasksRepository.updateTask(taskId, req.body)

      if (!updatedTask) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.status(HTTP_STATUSES.OK_200).json(getTaskViewModel(updatedTask))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
)

tasksRouter.delete("/:id", async (req: RequestWithParams<URIParamTaskIdType>, res: Response) => {
  const taskId = req.params.id
  try {
    const isDeleted = await tasksRepository.deleteTask(taskId)
    const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

    res.sendStatus(resultStatus)
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }
})
