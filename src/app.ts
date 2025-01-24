import express, { Request, Response } from "express"
import cors, { CorsOptions } from "cors"
import { tasksRouter } from "./routes/tasks.router"

export const app = express()

app.use(express.json())

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "https://addax-test-task.vercel.app"],
  credentials: true,
  exposedHeaders: "set-cookie",
}
app.use(cors(corsOptions))

app.get("/", async (req: Request, res: Response) => {
  res.json("Home")
})

app.use("/tasks", tasksRouter)
