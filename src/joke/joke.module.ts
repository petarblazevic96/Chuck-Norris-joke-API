import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JokeService } from './joke.service';
import { JokeController } from './joke.controller';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { JokeEmailConsumer } from './joke.consumer';

@Module({
  imports: [
    UsersModule, 
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [JokeController],
  providers: [JokeService, JokeEmailConsumer],
})
export class JokeModule {}
