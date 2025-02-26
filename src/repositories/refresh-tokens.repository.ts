import { addDays, addSeconds } from "date-fns"
import prisma from "../config/prisma.client"

class RefreshTokenRepository {
  async getTokenByUserId(userId: string) {
    return prisma.refreshToken.findUnique({ where: { userId } })
  }

  async saveToken(userId: string, refreshToken: string) {
    return prisma.refreshToken.upsert({
      where: { userId },
      create: { userId, token: refreshToken, expiresAt: addSeconds(new Date(), 41) },
      update: { token: refreshToken, expiresAt: addSeconds(new Date(), 41) },
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
