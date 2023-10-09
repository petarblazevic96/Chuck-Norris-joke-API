import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get<CustomLogger>(CustomLogger);

  app.useLogger(app.get(CustomLogger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.setGlobalPrefix("api");
  await app.listen(3000);
}

bootstrap();
