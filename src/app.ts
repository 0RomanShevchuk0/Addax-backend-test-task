import express from "express"
import cors, { CorsOptions } from "cors"
import AppRouter from "./routes"
import { errorHandler } from "./middlewares/error-handler/error-handler.midleware"
import cookieParser from "cookie-parser";


export const app = express()

app.use(express.json())
app.use(cookieParser());

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "https://addax-test-task.vercel.app"],
  credentials: true,
  exposedHeaders: "set-cookie",
}
app.use(cors(corsOptions))

const router = new AppRouter(app)

router.init()
app.use(errorHandler)
