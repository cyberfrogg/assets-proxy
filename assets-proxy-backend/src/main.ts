import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  app.setGlobalPrefix('api');
  console.log('Running app at port: ' + process.env.API_PORT);
  await app.listen(process.env.API_PORT);
}
bootstrap();
