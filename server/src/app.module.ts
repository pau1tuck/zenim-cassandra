import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExpressCassandraModule } from "@iaminfinity/express-cassandra";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserEntity } from "./user/entities/user.entity";
import { EmailLockEntity } from "./user/entities/columns/email-lock.entity";
import { UserService } from "./user/services/user.service";
import { UserResolver } from "./user/resolvers/user.resolver";

@Module({
    imports: [
        // Enable dotenv configuration
        ConfigModule.forRoot({ isGlobal: true }),
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
        // Start GraphQL (TypeGraphQL)
        GraphQLModule.forRoot({
            debug: Boolean(process.env.DEBUG),
            playground: Boolean(process.env.DEBUG),
            installSubscriptionHandlers: true,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            sortSchema: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, UserService, UserResolver],
})
export class AppModule {}
