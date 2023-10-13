import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { JokeQueue } from './joke-consumer.model';
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
