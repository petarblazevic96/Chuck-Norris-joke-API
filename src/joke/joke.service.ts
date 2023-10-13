import { Queue } from 'bull';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { catchError, firstValueFrom } from 'rxjs';

import { InjectQueue } from '@nestjs/bull';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';


import { SendJokeDto } from './dto/joke.dto';
import { UsersService } from '../users/users.service';
import { ChuckNorrisApi } from '../config/interfaces';

@Injectable()
export class JokeService {
  private CHUCK_NORRIS_API_URL;
  private CHUCK_NORRIS_API_PATH;

  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
    private usersService: UsersService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const config: ChuckNorrisApi | undefined =
      this.configService.get<ChuckNorrisApi>('chuck_norris_api');

    this.CHUCK_NORRIS_API_URL = config?.api_url;
    this.CHUCK_NORRIS_API_PATH = config?.api_path;
  }

  async getRandomJoke(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.CHUCK_NORRIS_API_URL}/${this.CHUCK_NORRIS_API_PATH}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException(
              'Error while fetching Chuck Norris joke',
              error.cause?.message || 'Error happened!',
            );
          }),
        ),
    );

    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.addEmailToQueue({
      email: user.email,
      value: data.value,
      url: data.url,
    });
  }

  private async addEmailToQueue(joke: SendJokeDto) {
    if (joke.email === null || joke.email.length === 0) {
      throw new InternalServerErrorException(
        'Sending joke failed',
        'Email was not provided',
      );
    }

    await this.emailQueue.add('sendEmail', joke, {
      jobId: uuidv4(),
    });
  }
}
