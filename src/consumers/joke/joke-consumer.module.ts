import { Module } from '@nestjs/common';
import { JokeEmailConsumer } from './joke.consumer';
import { JokeConsumerService } from './joke-consumer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JokeQueue } from './joke-consumer.model';
import { WinstonLogger } from '../../logger/logger.module';

@Module({
  providers: [JokeEmailConsumer, JokeConsumerService],
  imports: [SequelizeModule.forFeature([JokeQueue]), WinstonLogger],
})
export class JokeEmailConsumerModule {}
