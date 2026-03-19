import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { USER_REPOSITORY } from './domain/repositories/user.repository.js';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { RegisterUseCase } from './application/use-cases/register.use-case.js';
import { AuthController } from './presentation/controllers/auth.controller.js';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key-for-test-only',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    LoginUseCase,
    RegisterUseCase,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
