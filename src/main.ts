import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa la validación global con class-validator
  // Cualquier DTO con decoradores @IsString, @IsEmail...
  // se validará automáticamente en toda la app
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si llegan campos extra
    transform: true, // Convierte los datos al tipo del DTO automáticamente
  }));

  await app.listen(3000);
}
bootstrap();