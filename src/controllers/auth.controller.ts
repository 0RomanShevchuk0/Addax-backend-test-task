import { Request, Response } from "express"
import { RequestWithBody } from "../types/request.types"
import { AuthType } from "../types/auth/auth"
import { HTTP_STATUSES } from "../constants/http-statuses"
import { UserCreateType } from "../types/user/user-create"
import { mapUserToView } from "../mappers/user.mapper"
import { prismaErrorsHandler } from "../utils/prisma-error-handler"
import { requestContextService } from "../services/request-context.service"
import { authService } from "../services/auth.service"
import { emailService } from "../services/email.service"
import { jwtService } from "../services/jwt.service"

class AuthController {
  async login(req: RequestWithBody<AuthType>, res: Response) {
    const { email, password } = req.body

    const { user, accessToken, refreshToken } = await authService.login(email, password)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" })
    res.json({ accessToken, user: mapUserToView(user) })
  }

  async register(req: RequestWithBody<UserCreateType>, res: Response) {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body)

      if (!user) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message: "User registration failed" })
        return
      }

      emailService.sendWelcomeEmail(user.email, user.name)

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" })
      res.json({ accessToken, user: mapUserToView(user) })
    } catch (error) {
      prismaErrorsHandler(error, res)
    }
  }

  async me(req: Request, res: Response) {
    const { user } = requestContextService.getRequestContext()

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.json({ user: mapUserToView(user) })
  }

  async refreshToken(req: Request, res: Response) {
    const oldRefreshToken = req.cookies.refreshToken
    if (!oldRefreshToken) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const newTokens = await authService.getNewTokens(oldRefreshToken)

    if (!newTokens) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    res.json({ accessToken: newTokens.accessToken })
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    const userId = jwtService.getUserIdByToken(refreshToken)
    if (userId) {
      await authService.revokeRefreshToken(userId)
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}

export const authController = new AuthController()
