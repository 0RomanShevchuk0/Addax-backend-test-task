import { User } from "@prisma/client"
import { env } from "../config/env"
import jwt, { JwtPayload } from "jsonwebtoken"
import { TOKENS_DURATION_MS } from "../constants/tokens"

interface UserJwtPayload extends JwtPayload {
  userId: string
}

class JwtService {
  createJWT(user: User) {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables")
    }

    const userPayload: UserJwtPayload = { userId: user.id }
    const token = jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: TOKENS_DURATION_MS.ACCESS })
    return token
  }

  createRefreshToken(user: User) {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables")
    }

    const userPayload: UserJwtPayload = { userId: user.id }
    return jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: TOKENS_DURATION_MS.REFRESH })
  }

  getUserIdByToken(token: string): string | null {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables")
    }

    try {
      const result = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload
      return result?.userId || null
    } catch (error) {
      return null
    }
  }

  decodeRefreshToken(token: string): string | null {
    const result = jwt.decode(token) as UserJwtPayload
    return result.userId || null
  }
}

export const jwtService = new JwtService()
