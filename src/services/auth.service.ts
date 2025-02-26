import { User } from "@prisma/client"
import { UserCreateType } from "./../types/user/user-create"
import { jwtService } from "./jwt.service"
import { usersService } from "./users.service"
import { refreshTokenRepository } from "../repositories/refresh-tokens.repository"

type AuthReturnType = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

class AuthService {
  async login(email: string, password: string): Promise<AuthReturnType> {
    const user = await usersService.checkCredetrials(email, password)
    let accessToken = null
    let refreshToken = null

    if (user) {
      accessToken = jwtService.createJWT(user)

      refreshToken = jwtService.createRefreshToken(user)

      await refreshTokenRepository.saveToken(user.id, refreshToken)
    }

    return { user, accessToken, refreshToken }
  }

  async register(newUserData: UserCreateType): Promise<AuthReturnType> {
    const user = await usersService.createUser(newUserData)
    let accessToken = null
    let refreshToken = null

    if (user) {
      accessToken = jwtService.createJWT(user)

      refreshToken = jwtService.createRefreshToken(user)

      await refreshTokenRepository.saveToken(user.id, refreshToken)
    }

    return { user, accessToken, refreshToken }
  }

  async getNewTokens(oldRefreshToken: string): Promise<Omit<AuthReturnType, "user">> {
    const userId = jwtService.getUserIdByToken(oldRefreshToken)

    if (!userId) {
      throw new Error("invalid_token")
    }

    const user = await usersService.getUserById(userId)

    if (!user) {
      throw new Error("invalid_token")
    }

    const storedToken = await refreshTokenRepository.getTokenByUserId(user.id)
    if (!storedToken || storedToken.token !== oldRefreshToken) {
      throw new Error("token_mismatch")
    }

    if (new Date() > new Date(storedToken.expiresAt)) {
      await refreshTokenRepository.deleteToken(userId)
      throw new Error("token_expired")
    }

    const newAccessToken = jwtService.createJWT(user)
    const newRefreshToken = jwtService.createRefreshToken(user)

    const response = await refreshTokenRepository.updateToken(userId, newRefreshToken)

    return { accessToken: newAccessToken, refreshToken: response.token }
  }

  async revokeRefreshToken(userId: string) {
    await refreshTokenRepository.deleteAllTokensForUser(userId)
  }
}

export const authService = new AuthService()
