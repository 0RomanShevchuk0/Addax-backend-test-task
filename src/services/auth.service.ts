import { User } from "@prisma/client"
import { UserCreateType } from "./../types/user/user-create"
import { jwtService } from "./jwt.service"
import { usersService } from "./users.service"
import { refreshTokenRepository } from "../repositories/refresh-tokens.repository"

type authReturnType = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

class AuthService {
  async login(email: string, password: string): Promise<authReturnType> {
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

  async register(newUserData: UserCreateType): Promise<authReturnType> {
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

  async getNewTokens(oldRefreshToken: string) {
    const userId = jwtService.getUserIdByToken(oldRefreshToken)

    if (!userId) {
      return null
    }

    const user = await usersService.getUserById(userId)

    if (!user) {
      return null
    }

    const storedToken = await refreshTokenRepository.getTokenByUserId(user.id)
    if (!storedToken || storedToken.token !== oldRefreshToken) {
      return null
    }

    if (new Date() > new Date(storedToken.expiresAt)) {
      await refreshTokenRepository.deleteToken(userId)
      return null
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
