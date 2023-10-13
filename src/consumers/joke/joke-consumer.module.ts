import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { JokeQueue } from './joke-consumer.model';
import { JokeEmailConsumer } from './joke.consumer';
import { WinstonLogger } from '../../logger/logger.module';
import { JokeConsumerService } from './joke-consumer.service';

@Module({
  providers: [JokeEmailConsumer, JokeConsumerService],
  imports: [SequelizeModule.forFeature([JokeQueue]), WinstonLogger],
})
export class JokeEmailConsumerModule {}
