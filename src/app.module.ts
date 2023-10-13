import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { JokeModule } from './joke/joke.module';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { WinstonLogger } from './logger/logger.module';
import { DatabaseConfiguration, RedisConfiguration } from './config/interfaces';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    WinstonLogger,
    JokeModule,
    UsersModule,
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseConfig: DatabaseConfiguration | undefined =
          configService.get<DatabaseConfiguration>('database');

        return {
          dialect: 'postgres',
          autoLoadModels: true,
          synchronize: true,
          host: databaseConfig?.host,
          port: databaseConfig?.port,
          username: databaseConfig?.username,
          password: databaseConfig?.password,
          database: databaseConfig?.database_name,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig: RedisConfiguration | undefined =
          configService.get<RedisConfiguration>('redis');

        return {
          redis: {
            host: redisConfig?.host,
            port: redisConfig?.port,
          },
          defaultJobOptions: {
            attempts: Number(redisConfig?.default_job_options.attempts),
            timeout: Number(redisConfig?.default_job_options.timeout),
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule {}
