import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipeErrorsFormatted } from '@app/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });
  const config = new DocumentBuilder()
    .setTitle('Todos')
    .setDescription('The NestJS Todos API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(ValidationPipeErrorsFormatted());

  await app.listen(5000);
}
bootstrap();
