import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipeErrorsFormatted } from 'utils';

async function bootstrap() {
  const isDev = process.env.CURRENT_ENVIRONMENT === 'dev';

  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      // origin: isDev ? 'http://localhost:3000' : '',
      origin: 'http://localhost:3000',
    },
  });
  const config = new DocumentBuilder()
    .setTitle('Todos')
    .setDescription('The NestJS Todos API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  isDev && SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(ValidationPipeErrorsFormatted());

  await app.listen(5000);
}
bootstrap();
