import { User } from "@prisma/client"
import { env } from "../config/env"
import jwt, { JwtPayload } from "jsonwebtoken"

interface UserJwtPayload extends JwtPayload {
  userId: string
}

class JwtService {
  createJWT(user: User) {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables")
    }

    const userPayload: UserJwtPayload = { userId: user.id }
    const token = jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: "20s" })
    return token
  }

  createRefreshToken(user: User) {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables")
    }
		
    const userPayload: UserJwtPayload = { userId: user.id }
    return jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: "7d" })
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
}

export const jwtService = new JwtService()
