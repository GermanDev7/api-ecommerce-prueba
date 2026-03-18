import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ProductsModule } from './contexts/products/products.module.js';
import { configValidationSchema } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TerminusModule,
    ProductsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
