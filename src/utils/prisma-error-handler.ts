import { Response } from "express"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { Prisma } from "@prisma/client"
import { PRISMA_ERROR_CODES } from "../constants/prisma-error-codes"

export const prismaErrorsHandler = (error: any, res: Response) => {
  console.error("Error:", error)

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION:
        return res.status(400).json({
          message: "A user with this email already exists. Please use a different email.",
        })

      case PRISMA_ERROR_CODES.RECORD_NOT_FOUND:
        return res.status(404).json({ message: "User not found." })

      case PRISMA_ERROR_CODES.INVALID_DATA_TYPE:
        return res.status(400).json({ message: "Invalid data type provided." })

      case PRISMA_ERROR_CODES.DATA_TOO_LONG:
        return res.status(400).json({ message: "Input data is too long." })

      default:
        return res.status(500).json({ message: "An unexpected error occurred." })
    }
  }

  res
    .status(HTTP_STATUSES.SERVER_ERROR_500)
    .json({ message: "An unexpected error occurred. Please try again later." })
}
