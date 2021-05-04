import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExpressCassandraModule } from "@iaminfinity/express-cassandra";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserEntity } from "./users/entities/user.entity";
import { UsersService } from "./users/users.service";
import { UsersResolver } from "./users/resolvers/users.resolver";

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
        }) /*
        ExpressCassandraModule.forRootAsync({
            inject: [UsersService],
        }), */,
        // Load database entities
        ExpressCassandraModule.forFeature([UserEntity]),
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
    providers: [AppService, UsersService, UsersResolver],
})
export class AppModule {}
