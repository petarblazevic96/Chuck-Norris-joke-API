import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';
import { WinstonLogger } from '../logger/logger.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [WinstonLogger, UsersModule],
})
export class AuthModule {}
