import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 4200,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
}
