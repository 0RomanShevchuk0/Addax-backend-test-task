import { Router } from "express"
import { inputValidationMiddlevare } from "../../middlewares/input-validation-middlevare"
import { userValidation } from "../../validation/user.validation"
import { userController } from "../../controllers/users.controller"
import { asyncHandler } from "../../middlewares/error-handler/async-handler"

export const usersRouter = Router()

usersRouter.get("/", asyncHandler(userController.getAll))

usersRouter.get("/:id", asyncHandler(userController.getById))

usersRouter.post(
  "/",
  userValidation,
  inputValidationMiddlevare,
  asyncHandler(userController.createOne)
)

usersRouter.patch(
  "/:id",
  userValidation,
  inputValidationMiddlevare,
  asyncHandler(userController.updateOne)
)

usersRouter.delete("/:id", asyncHandler(userController.deleteOne))
