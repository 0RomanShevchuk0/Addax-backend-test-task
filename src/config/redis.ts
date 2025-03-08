import Redis from "ioredis"
import { env } from "./env"

if (!env.REDIS_URL) {
  throw new Error("REDIS_URL is missing in env variables")
}

const redis = new Redis(env.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false })

redis.on("connect", () => console.log("🔌 Redis connected"))
redis.on("error", (err) => console.error("❌ Redis error:", err))

export default redis
