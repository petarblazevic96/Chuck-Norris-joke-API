import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JokeModule } from './joke/joke.module';

@Module({
  imports: [
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
  ]
})
export class AppModule {}
