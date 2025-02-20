import { Response } from "express"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { MONGO_ERROR_CODES } from "../constants/mongo-error-codes"

export const createUserErrorHandler = (error: any, res: Response) => {
  console.error("Error creating user:", error)

  if (error?.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
    res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ message: "A user with this email already exists. Please use a different email." })

    return
  }

  res
    .status(HTTP_STATUSES.SERVER_ERROR_500)
    .json({ message: "An unexpected error occurred. Please try again later." })
}
