import { Op, ValidationError } from 'sequelize';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.model';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    let user: User | null;
    try {
      user = await this.userModel.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createNewUser(user: CreateUserDTO): Promise<string | null> {
    let newUser: User;
    try {
      newUser = await this.userModel.create({ ...user });
      return newUser.id;
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationError = error.errors[0]
          ? error.errors[0].message
          : error.message;
        throw new ForbiddenException(validationError);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getUserById(id: string): Promise<User | null> {
    let user: User | null;
    try {
      user = await this.userModel.findOne({
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
