import { addDays } from "date-fns"
import prisma from "../config/prisma.client"
import { REFRESH_TOKEN_DAYS_DURATION } from "../constants/tokens"

class RefreshTokenRepository {
  async getTokenByUserId(userId: string) {
    return prisma.refreshToken.findUnique({ where: { userId } })
  }

  async saveToken(userId: string, refreshToken: string) {
    return prisma.refreshToken.upsert({
      where: { userId },
      create: {
        userId,
        token: refreshToken,
        expiresAt: addDays(new Date(), REFRESH_TOKEN_DAYS_DURATION),
      },
      update: { token: refreshToken, expiresAt: addDays(new Date(), REFRESH_TOKEN_DAYS_DURATION) },
    })
  }

  async updateToken(userId: string, newRefreshToken: string) {
    return prisma.refreshToken.update({
      where: { userId },
      data: { token: newRefreshToken },
    })
  }

  async deleteToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } })
  }

  async deleteAllTokensForUser(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } })
  }
}

export const refreshTokenRepository = new RefreshTokenRepository()
