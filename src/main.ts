import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get<CustomLogger>(CustomLogger);

  app.useLogger(app.get(CustomLogger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Chuck Norris random joke API")
    .setDescription("Documentation for Chuck Norris random joke API")
    .addBearerAuth({
      type: 'http', 
      scheme: "Bearer", 
      bearerFormat: "JWT", 
      in: "header"
    })
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("documentation", app, document);

  await app.listen(3000);
}

bootstrap();
