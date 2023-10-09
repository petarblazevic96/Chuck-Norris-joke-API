import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { SendJokeDto } from './dto/joke.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class JokeService {
    //TODO move to config
    private CHUCK_NORRIS_API_URL;
    private CHUCK_NORRIS_API_PATH;

    constructor(
        @InjectQueue("email") 
        private readonly emailQueue: Queue,
        private usersService: UsersService,
        private httpService: HttpService,
        private logger: CustomLogger
    ) {
        this.CHUCK_NORRIS_API_URL = "https://api.chucknorris.io/";
        this.CHUCK_NORRIS_API_PATH = "jokes/random";
    }

    async getRandomJoke(id: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.CHUCK_NORRIS_API_URL}/${this.CHUCK_NORRIS_API_PATH}`).pipe(
                catchError((error: AxiosError) => {
                    throw new InternalServerErrorException("Error while fetching Chuck Norris joke", {
                        cause: error.cause,
                        description: error.code
                    });
                })
            )
        );
        
        const user = await this.usersService.getUserById(id);
        if (!user) { 
            throw new NotFoundException("User not found!"); 
        }
        
        await this.addEmailToQueue({ email: user.email, value: data.value, url: data.url });
    }

    private async addEmailToQueue(joke: SendJokeDto) {
        if (joke.email === null || joke.email.length === 0) {
            throw new InternalServerErrorException("Sending joke failed", "Email was not provided");
        }
        
        await this.emailQueue.add("sendEmail", joke, {
            jobId: uuidv4()
        });
    }
}
