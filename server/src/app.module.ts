import { join } from "path";
import { Module } from "@nestjs/common";
import { ExpressCassandraModule } from "@iaminfinity/express-cassandra";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        ExpressCassandraModule.forRoot({
            clientOptions: {
                contactPoints: [String(process.env.DB_CONTACT_POINTS)],
                protocolOptions: { port: Number(process.env.DB_PORT) },
                keyspace: String(process.env.DB_KEYSPACE),
            },
        }),
        GraphQLModule.forRoot({
            debug: Boolean(process.env.DEBUG),
            playground: Boolean(process.env.DEBUG),
            installSubscriptionHandlers: true,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            sortSchema: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
