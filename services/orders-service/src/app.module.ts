import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { OrdersModule } from './contexts/orders/orders.module.js';
import { configValidationSchema } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TerminusModule,
    OrdersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
