import argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        const hashedInputPassword = await argon2.hash(password);
        
        if (user?.password !== hashedInputPassword) {
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
}
