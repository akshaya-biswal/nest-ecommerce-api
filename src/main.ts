import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out extra fields
      forbidNonWhitelisted: true, // throws if extra fields are sent
      transform: true, // auto-transforms input into class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
