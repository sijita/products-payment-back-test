import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeDatabase } from './database/data-source';

async function bootstrap() {
  try {
    await initializeDatabase();

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(3000);
  } catch (error) {
    console.error('Error during bootstrapping:', error);
    process.exit(1);
  }
}
bootstrap();
