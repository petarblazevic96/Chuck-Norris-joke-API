import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.model';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });
    }

    async createNewUser(user: CreateUserDTO): Promise<User> {
        return this.userModel.create({...user});
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
    }
}
