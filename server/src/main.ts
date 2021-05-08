import { NestFactory } from "@nestjs/core";
import session from "express-session";
import { v4 } from "uuid";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        session({
            name: "sid",
            genid: () => v4(),
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
    await app.listen(5000);
}
bootstrap();
