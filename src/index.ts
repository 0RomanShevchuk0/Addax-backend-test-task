import { app } from "./app"
import { env } from "./config/env"

const port = env.PORT

const startApp = async () => {
  app.listen(port, () => {
    console.log(`App listening port ${port}`)
  })
}

startApp()
