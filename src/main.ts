import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  app.setGlobalPrefix('api');
  const port = process.env.BACK_PORT || 4242;
  await app.listen(port);
  Logger.log(`Server running on ${port}`)
}
bootstrap();
