import { Injectable } from '@nestjs/common';
import { JokeQueue } from './joke-consumer.model';
import { InjectModel } from '@nestjs/sequelize';
import { SaveJokeQueueDto } from './dto/save-joke-queue.dto';

@Injectable()
export class JokeConsumerService {
  constructor(
    @InjectModel(JokeQueue)
    private jokeQueue: typeof JokeQueue,
  ) {}

  async saveJob(data: SaveJokeQueueDto) {
    await this.jokeQueue.create({ ...data });
  }
}
