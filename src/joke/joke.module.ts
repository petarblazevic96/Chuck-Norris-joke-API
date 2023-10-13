import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

import { JokeService } from './joke.service';
import { JokeController } from './joke.controller';
import { UsersModule } from '../users/users.module';
import { WinstonLogger } from '../logger/logger.module';
import { JokeEmailConsumerModule } from '../consumers/joke/joke-consumer.module';

@Module({
  imports: [
    WinstonLogger,
    UsersModule,
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    JokeEmailConsumerModule,
  ],
  controllers: [JokeController],
  providers: [JokeService],
})
export class JokeModule {}
