import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppInitializationService } from './app-initialization/app-initialization.service';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const initializationService = app.get(AppInitializationService);
  await initializationService.initialize();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
