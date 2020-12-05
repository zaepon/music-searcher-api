import Redis from "ioredis";

export const redisClient = new Redis(
  6379,
  process.env.REDIS_HOST || "127.0.0.1"
);
