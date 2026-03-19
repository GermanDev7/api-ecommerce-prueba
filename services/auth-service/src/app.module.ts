import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './contexts/auth/auth.module.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TerminusModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
