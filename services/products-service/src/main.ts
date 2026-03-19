import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from '@ecommerce/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('ProductsService');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Products Service')
    .setDescription('API for managing the product catalog')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/api/v1/products/docs-json', name: 'Products API' },
        { url: '/api/v1/orders/docs-json', name: 'Orders API' },
        { url: '/api/v1/auth/docs-json', name: 'Auth API' },
      ],
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Products service running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
