import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User with provided email does not exist!');
    } else if (!(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Wrong password!');
    }

    const payload = { id: user?.id.toString() };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
