import { Application, Request, Response } from "express"
import { tasksRouter } from "./api/tasks.router"
import { usersRouter } from "./api/users.router"
import { authRouter } from "./api/auth.router"

class AppRouter {
  constructor(private app: Application) {}

  init() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("API Running")
    })
		
    this.app.use("/tasks", tasksRouter)
    this.app.use("/users", usersRouter)
    this.app.use("/auth", authRouter)
  }
}

export default AppRouter
