import { User } from "@prisma/client"
import { UserCreateType } from "./../types/user/user-create"
import { jwtService } from "./jwt.service"
import { usersService } from "./users.service"

type authReturnType = {
  user: User | null
  accessToken: string | null
}

class AuthService {
  async login(email: string, password: string): Promise<authReturnType> {
    const user = await usersService.checkCredetrials(email, password)
    let accessToken = null

    if (user) {
      accessToken = jwtService.createJWT(user)
    }

    return { user, accessToken }
  }

  async register(newUserData: UserCreateType): Promise<authReturnType> {
    const user = await usersService.createUser(newUserData)
    let accessToken = null

    if (user) {
      accessToken = jwtService.createJWT(user)
    }

    return { user, accessToken }
  }
}

export const authService = new AuthService()
