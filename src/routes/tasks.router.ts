import { Router } from "express"
import { inputValidationMiddlevare } from "../middlewares/input-validation-middlevare"
import { taskValidation } from "../validation/task.validation"
import { tasksController } from "../controllers/tasks.controller"

export const tasksRouter = Router()

tasksRouter.get("/", tasksController.getAll)

tasksRouter.get("/:id", tasksController.getOneById)

tasksRouter.post("/", taskValidation, inputValidationMiddlevare, tasksController.createOne)

tasksRouter.patch("/:id", taskValidation, inputValidationMiddlevare, tasksController.updateOne)

tasksRouter.delete("/:id", tasksController.deleteOne)
