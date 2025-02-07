import { asyncHandler } from "../../middlewares/error-handler/async-handler"
import { Router } from "express"
import { inputValidationMiddlevare } from "../../middlewares/input-validation-middlevare"
import { taskValidation } from "../../validation/task.validation"
import { tasksController } from "../../controllers/tasks.controller"
import { authMiddleware } from "../../middlewares/auth.middlewware"

export const tasksRouter = Router()

tasksRouter.get("/", authMiddleware, asyncHandler(tasksController.getAll))

tasksRouter.get("/:id", authMiddleware, asyncHandler(tasksController.getOneById))

tasksRouter.post(
  "/",
  authMiddleware,
  taskValidation,
  inputValidationMiddlevare,
  asyncHandler(tasksController.createOne)
)

tasksRouter.patch(
  "/:id",
  authMiddleware,
  taskValidation,
  inputValidationMiddlevare,
  asyncHandler(tasksController.updateOne)
)

tasksRouter.delete("/:id", authMiddleware, asyncHandler(tasksController.deleteOne))
