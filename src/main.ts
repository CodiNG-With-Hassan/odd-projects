import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsConfig } from './shared/models/cors-config.model';

const bootstrap: () => Promise<void> = async(): Promise<void> => {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port = +(process.env.APP_PORT || 3000);
  const logger: Logger = new Logger('bootstrap');

  const cors: CorsConfig = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(cors);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configuration: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('Workforce')
  .setDescription('Workforce Official')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log(`Application is running on port ${port}`);
};
bootstrap();
