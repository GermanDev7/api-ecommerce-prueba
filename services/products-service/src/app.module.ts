import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ProductsModule } from './contexts/products/products.module.js';
import { configValidationSchema } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    JwtModule.register({ global: true }),
    TerminusModule,
    ProductsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
