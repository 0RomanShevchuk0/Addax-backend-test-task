import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../../constants/httpStatuses"

const errorMessages: Record<number | "default", string> = {
  400: "Bad Request",
  500: "Internal Server Error",
  default: "Error Occurred",
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("🔥 Error:", err)

  if (res.headersSent) {
    return next(err)
  }

  res.status(err.status || HTTP_STATUSES.SERVER_ERROR_500).json({
    message: errorMessages[err.status || "default"],
  })
}
