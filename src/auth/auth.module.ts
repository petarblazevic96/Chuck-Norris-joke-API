import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      //TODO move this to config
      secret: "SOME_SECRET",
      signOptions: {
        expiresIn: "60s"
      }
    })
  ]
})
export class AuthModule {}
