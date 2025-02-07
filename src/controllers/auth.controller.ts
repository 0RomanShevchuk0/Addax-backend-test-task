import { Response } from "express"
import { RequestWithBody } from "../types/request.types"
import { AuthType } from "../types/auth/auth"
import { usersService } from "../services/users.service"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { jwtService } from "../services/jwt.service"
import { UserCreateType } from "../types/user/user-create"
import { getUserViewModel } from "../mappers/user.mapper"
import { createUserErrorHandler } from "../utils/create-user-error-handler"

class AuthController {
  async login(req: RequestWithBody<AuthType>, res: Response) {
    const { email, password } = req.body

    const user = await usersService.checkCredetrials(email, password)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const accessToken = jwtService.createJWT(user)

    res.json({ accessToken, user: getUserViewModel(user) })
  }

  async register(req: RequestWithBody<UserCreateType>, res: Response) {
    try {
      const user = await usersService.createUser(req.body)

      if (!user) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message: "User registration failed" })
        return
      }

      const accessToken = jwtService.createJWT(user)

      res.json({ accessToken, user: getUserViewModel(user) })
    } catch (error) {
      createUserErrorHandler(error, res)
    }
  }
}

export const authController = new AuthController()
