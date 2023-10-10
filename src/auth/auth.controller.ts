import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    @ApiOperation({ summary: "Login user and return bearer token." })
    @ApiResponse({ status: HttpStatus.OK, description: "Successfully logs in the user and returns the bearer token"} )
    @ApiBody({
        type: SignInDto,
        examples: {
            a: {
                summary: "Sign in in payload",
                value: {
                    email: "mail@mail.com",
                    password: "password"
                } as SignInDto
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post("login")
    async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto.email, signInDto.password);
    }

    @ApiOperation({ summary: "Creates a new user." })
    @ApiResponse({ status: HttpStatus.OK, description: "Successfully creates a new user in the database"} )
    @ApiBody({
        type: CreateUserDTO,
        examples: {
            a: {
                summary: "Signup in payload",
                value: {
                    firstName: "Name",
                    lastName: "Last name",
                    email: "mail@mail.com",
                    password: "password"
                } as CreateUserDTO
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    @Post("signup")
    async signUp(@Body() userData: CreateUserDTO) {
        return await this.userService.createNewUser(userData);
    }
}
