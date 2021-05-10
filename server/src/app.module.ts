import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExpressCassandraModule } from "@iaminfinity/express-cassandra";
import { RedisModule } from "nestjs-redis";
import {
    NestCookieSessionOptions,
    CookieSessionModule,
} from "nestjs-cookie-session";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserEntity } from "./modules/user/entities/user.entity";
import { EmailLockEntity } from "./modules/user/entities/columns/email-lock.entity";
import { UserService } from "./modules/user/services/user.service";
import { UserResolver } from "./modules/user/resolvers/user.resolver";

@Module({
    imports: [
        // Enable dotenv configuration
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        // Connect to Apache Cassandra database
        ExpressCassandraModule.forRoot({
            clientOptions: {
                contactPoints: [String(process.env.DB_CONTACT_POINTS)],
                protocolOptions: { port: Number(process.env.DB_PORT) || 9042 },
                keyspace: String(process.env.DB_KEYSPACE),
            },
            ormOptions: {
                migration: "drop",
            },
        }) /*
        ExpressCassandraModule.forRootAsync({
            inject: [UsersService],
        }), */,
        // Load database entities
        ExpressCassandraModule.forFeature([UserEntity, EmailLockEntity]),
        RedisModule.register({
            host: String(process.env.REDIS_HOST),
            port: Number(process.env.REDIS_PORT),
        }),
        CookieSessionModule.forRoot({
            session: { secret: String(process.env.SESSION_SECRET) },
        }),
        // Start GraphQL (TypeGraphQL)
        GraphQLModule.forRoot({
            debug: Boolean(process.env.DEBUG),
            playground: {
                endpoint: "/graphql",
                settings: { "request.credentials": "include" },
            },
            installSubscriptionHandlers: true,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            sortSchema: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, UserService, UserResolver],
})
export class AppModule {}
