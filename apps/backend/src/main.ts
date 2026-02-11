import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;

  await app.listen(port, host);
  console.log(`Backend listening on http://${host}:${port}`);
}

bootstrap();
