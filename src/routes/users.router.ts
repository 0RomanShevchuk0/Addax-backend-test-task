import { Router } from "express"
import { inputValidationMiddlevare } from "../middlewares/input-validation-middlevare"
import { userValidation } from "../validation/user.validation"
import { userController } from "../controllers/users.controller"

export const usersRouter = Router()

usersRouter.get("/", userController.getAll)

usersRouter.get("/:id", userController.getById)

usersRouter.post("/", userValidation, inputValidationMiddlevare, userController.createOne)

usersRouter.patch("/:id", userValidation, inputValidationMiddlevare, userController.updateOne)

usersRouter.delete("/:id", userController.deleteOne)
