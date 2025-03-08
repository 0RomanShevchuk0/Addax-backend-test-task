import Redis from "ioredis"
import { env } from "./env"

if (!env.REDIS_URL) {
  throw new Error("REDIS_URL is missing in env variables")
}

const redis = new Redis(env.REDIS_URL, {
  connectTimeout: 5000, // 5 сек на подключение
  maxRetriesPerRequest: 2, // Ограничение на ретраи
  lazyConnect: true, // Подключение только при первом запросе
  keepAlive: 1, // Поддержка TCP Keep-Alive
  enableAutoPipelining: true, // Оптимизация команд
})

redis.on("connect", () => console.log("🔌 Redis connected"))
redis.on("error", (err) => console.error("❌ Redis error:", err))

async function testRedisLatency() {
  const start = Date.now()
  try {
    await redis.ping()
    console.log(`✅ Redis PING time: ${Date.now() - start}ms`)
  } catch (err) {
    console.error("❌ Redis PING failed:", err)
  } finally {
    redis.quit()
  }
}

testRedisLatency()

export default redis
