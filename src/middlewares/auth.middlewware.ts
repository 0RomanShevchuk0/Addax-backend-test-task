import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { jwtService } from "../services/jwt.service"
import { usersService } from "../services/users.service"
import { requestContextService } from "../services/request-context.service"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  const userId = jwtService.getUserIdByToken(token)

  if (!userId) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  const user = await usersService.getUserById(userId)

  if (!user) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  requestContextService.runWithRequestContext(
    () => {
      next()
    },
    { user }
  )
}
