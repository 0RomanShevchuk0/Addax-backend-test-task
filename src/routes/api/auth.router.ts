import { Router } from "express"
import { inputValidationMiddlevare } from "../../middlewares/input-validation-middlevare"
import { authController } from "../../controllers/auth.controller"
import { asyncHandler } from "../../middlewares/error-handler/async-handler"
import { authValidation } from "../../validation/auth.validations"

export const authRouter = Router()

authRouter.post(
  "/login",
  authValidation,
  inputValidationMiddlevare,
  asyncHandler(authController.login)
)
authRouter.post(
  "/register",
  authValidation,
  inputValidationMiddlevare,
  asyncHandler(authController.register)
)
