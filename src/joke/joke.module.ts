import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JokeService } from './joke.service';
import { JokeController } from './joke.controller';

import { BullModule } from '@nestjs/bull';
import { JokeEmailConsumerModule } from '../consumers/joke/joke-consumer.module';
import { WinstonLogger } from '../logger/logger.module';
import { UsersModule } from '../users/users.module';

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
