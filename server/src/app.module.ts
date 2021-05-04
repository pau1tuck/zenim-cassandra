import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: Boolean(process.env.DEBUG),
      playground: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
