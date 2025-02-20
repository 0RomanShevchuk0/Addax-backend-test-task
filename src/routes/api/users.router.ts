import { Router } from "express"
import { inputValidationMiddlevare } from "../../middlewares/input-validation-middlevare"
import { userCreateValidation, userUpdateValidation } from "../../validation/user.validation"
import { userController } from "../../controllers/users.controller"
import { asyncHandler } from "../../middlewares/error-handler/async-handler"
import { authMiddleware } from "../../middlewares/auth.middlewware"
import { upload } from "../../config/multer.config"

export const usersRouter = Router()

usersRouter.get("/", asyncHandler(userController.getAll))

usersRouter.get("/:id", asyncHandler(userController.getById))

usersRouter.post(
  "/",
  userCreateValidation,
  inputValidationMiddlevare,
  asyncHandler(userController.createOne)
)

usersRouter.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  asyncHandler(userController.uploadProfilePhoto)
)

usersRouter.patch(
  "/:id",
  authMiddleware,
  userUpdateValidation,
  inputValidationMiddlevare,
  asyncHandler(userController.updateOne)
)

usersRouter.delete("/:id", authMiddleware, asyncHandler(userController.deleteOne))
