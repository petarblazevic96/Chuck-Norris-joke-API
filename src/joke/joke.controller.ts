import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JokeService } from './joke.service';
import { UserDecorator } from 'src/users/decorators/user.decorator';
import { UserAuthDto } from 'src/auth/dto/user-auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Joke")
@Controller('joke')
export class JokeController {
    constructor(
        private jokeService: JokeService,
    ){}
    
    @ApiBearerAuth()
    @ApiOperation({ summary: "Send random joke to the logged in user." })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden." })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Email added to the queue." })
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    @Get("random")
    async random(@UserDecorator() user: UserAuthDto) {
        await this.jokeService.getRandomJoke(user.id);
    }
}
