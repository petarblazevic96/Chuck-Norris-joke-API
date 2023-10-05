import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { JokeService } from './joke.service';
import { UserDecorator } from 'src/users/decorators/user.decorator';
import { UserAuthDto } from 'src/auth/dto/user-auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('joke')
export class JokeController {
    constructor(private jokeService: JokeService){}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    @Get("random")
    async random(@UserDecorator() user: UserAuthDto) {
        await this.jokeService.getRandomJoke(user.id);
    }
}
