import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";

export const redisClient = new Redis({
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT),
    family: Number(process.env.REDIS_FAMILY),
    password: String(process.env.REDIS_PASS),
    db: Number(process.env.REDIS_DB),
    enableReadyCheck: !!process.env.DEBUG,
});

export const sessionStore = connectRedis(session);
