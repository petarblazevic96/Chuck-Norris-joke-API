import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [SequelizeModule.forFeature([User])]
})
export class UsersModule {}
