import { env } from "../config/env"
import { IUser } from "./../models/user.model"
import jwt, { JwtPayload } from "jsonwebtoken"

interface UserJwtPayload extends JwtPayload {
  userId: string
}

export const jwtService = {
  createJWT(user: IUser) {
    const userPayload: UserJwtPayload = { userId: user.id }
    const token = jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: "2h" })
    return token
  },

  getUserIdByToken(token: string): string | null {
    try {
      const result = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload
      return result?.userId || null
    } catch (error) {
      return null
    }
  },
}
