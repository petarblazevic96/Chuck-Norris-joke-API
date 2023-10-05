import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { SendJokeDto } from './dto/joke.dto';

@Injectable()
export class JokeService {
    //TODO move to config
    private CHUCK_NORRIS_API_URL;
    private CHUCK_NORRIS_API_PATH;

    constructor(
        private usersService: UsersService,
        private httpService: HttpService
    ) {
        this.CHUCK_NORRIS_API_URL = "https://api.chucknorris.io/";
        this.CHUCK_NORRIS_API_PATH = "jokes/random";
    }

    async getRandomJoke(id: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.CHUCK_NORRIS_API_URL}/${this.CHUCK_NORRIS_API_PATH}`).pipe(
                catchError((error: AxiosError) => {
                    //TODO add loger
                    console.error("Error happened: ", error);
                    throw "Error";
                })
            )
        );
        const user = await this.usersService.getUserById(id);
        
        this.sendEmailToUser(user?.email, { value: data.value, url: data.url });
    }

    private async sendEmailToUser(email: string | undefined, joke: SendJokeDto) {
        if (email === undefined) {
            //TODO log error
            console.error("Email was not provided");
            return;
        }

        //TODO send email
    }
}
