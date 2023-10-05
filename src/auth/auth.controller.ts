import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto.email, signInDto.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("signup")
    async signUp(@Body() userData: CreateUserDTO) {
        return await this.userService.createNewUser(userData);
    }
}
