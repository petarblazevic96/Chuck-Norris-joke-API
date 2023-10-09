import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JokeModule } from './joke/joke.module';
import { BullModule } from '@nestjs/bull';
import { WinstonLogger } from './logger/logger.module';

@Module({
  imports: [
    WinstonLogger,
    JokeModule,
    AuthModule, 
    UsersModule,
    SequelizeModule.forRoot({
      dialect: "postgres",
      autoLoadModels: true,
      synchronize: true,
      //TODO transfer this to config later
      host: "localhost",
      port: 5432,
      database: "chuck_norris_joke_app"
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        timeout: 30000
      }
    })
  ]
})
export class AppModule {}
