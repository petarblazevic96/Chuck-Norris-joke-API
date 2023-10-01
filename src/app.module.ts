import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    SequelizeModule.forRoot({
      dialect: "postgres",
      models: [],
      //TODO transfer this to config later
      host: "localhost",
      port: 5432,
      database: "chuck_norris_joke_app"
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
