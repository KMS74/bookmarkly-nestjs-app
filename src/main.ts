import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // apply the global validation pipe to the app
  // this will validate all incoming requests against the DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // will remove any additional properties that are not in the DTO
    }),
  );
  // add api prefix to all routes in the app
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
