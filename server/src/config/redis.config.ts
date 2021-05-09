import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";

export const redisClient = new Redis({
    host: String(process.env.REDIS_HOST) || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    family: Number(process.env.REDIS_FAMILY) || 4,
    password: String(process.env.REDIS_PASS) || "",
    db: Number(process.env.REDIS_DB) || 0,
    enableReadyCheck: true,
});

export const sessionStore = connectRedis(session);
