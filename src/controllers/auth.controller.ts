import { Request, Response } from "express"
import { RequestWithBody } from "../types/request.types"
import { AuthType } from "../types/auth/auth"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { UserCreateType } from "../types/user/user-create"
import { getUserViewModel } from "../mappers/user.mapper"
import { createUserErrorHandler } from "../utils/create-user-error-handler"
import { requestContextService } from "../services/request-context.service"
import { authService } from "../services/auth.service"

class AuthController {
  async login(req: RequestWithBody<AuthType>, res: Response) {
    const { email, password } = req.body

    const { user, accessToken } = await authService.login(email, password)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.json({ accessToken, user: getUserViewModel(user) })
  }

  async register(req: RequestWithBody<UserCreateType>, res: Response) {
    try {
      const { user, accessToken } = await authService.register(req.body)

      if (!user) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message: "User registration failed" })
        return
      }

      res.json({ accessToken, user: getUserViewModel(user) })
    } catch (error) {
      createUserErrorHandler(error, res)
    }
  }

  async me(req: Request, res: Response) {
    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.json({ user: getUserViewModel(user) })
  }
}

export const authController = new AuthController()
