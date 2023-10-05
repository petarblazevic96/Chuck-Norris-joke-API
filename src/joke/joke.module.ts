import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JokeService } from './joke.service';
import { JokeController } from './joke.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule, 
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    })
  ],
  controllers: [JokeController],
  providers: [JokeService],
})
export class JokeModule {}
