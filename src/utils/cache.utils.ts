import redis from "../config/redis"

export const getCachedData = async (key: string) => {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export const setCacheData = async (key: string, data: any, ttl = 3600) => {
  await redis.set(key, JSON.stringify(data), "EX", ttl) 
}

export const deleteCacheData = async (key: string) => {
  await redis.del(key)
}
