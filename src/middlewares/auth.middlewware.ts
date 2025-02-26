import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { jwtService } from "../services/jwt.service"
import { usersService } from "../services/users.service"
import { requestContextService } from "../services/request-context.service"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send("jwt must be provided")
    return
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).json({ message: "jwt must be provided" })
  }

  const userId = jwtService.getUserIdByToken(token)

  if (!userId) {
    return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).json({ message: "Invalid or expired jwt" })
  }

  const user = await usersService.getUserById(userId)

  if (!user) {
    return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).json({ message: "User not found" })
  }

  requestContextService.runWithRequestContext(
    () => {
      next()
    },
    { user }
  )
}
