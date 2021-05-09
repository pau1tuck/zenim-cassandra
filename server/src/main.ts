import { v4 } from "uuid";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import { sessionStore, redisClient } from "./config/redis.config";

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.use(
        session({
            name: "sid",
            genid: () => v4(),
            store: new sessionStore({
                client: redisClient,
                disableTouch: true,
                disableTTL: Boolean(process.env.DEBUG),
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: false,
                sameSite: process.env.NODE_ENV === "production" ? true : "lax",
                secure: process.env.NODE_ENV === "production",
            },
            secret: String(process.env.SESSION_SECRET) || "secret",
            resave: false,
            saveUninitialized: false,
        }),
    );

    redisClient.monitor((error, monitor) => {
        if (error) {
            console.log(error);
        }
        if (process.env.DEBUG) {
            monitor.on("monitor", (time, args, source) => {
                console.log(time, args, source);
            });
        }
    });

    await app.listen(5000);
};
bootstrap();
