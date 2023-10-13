import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JokeService } from './joke.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserAuthDto } from '../auth/dto/user-auth.dto';
import { UserDecorator } from '../users/decorators/user.decorator';

@ApiTags('Joke')
@Controller('joke')
export class JokeController {
  constructor(private jokeService: JokeService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send random joke to the logged in user.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Email added to the queue.',
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('random')
  async random(@UserDecorator() user: UserAuthDto) {
    await this.jokeService.getRandomJoke(user.id);
  }
}
