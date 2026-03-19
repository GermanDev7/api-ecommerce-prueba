import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/entities/user.entity.js';
import { RegisterDto } from '../../presentation/dtos/register.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<{ id: string; email: string }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        'El usuario con este correo electrónico ya existe',
      );
    }

    const saltRoutes = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRoutes);

    const newUser: User = {
      id: crypto.randomUUID(),
      email: dto.email,
      name: dto.name || null,
      passwordHash,
      role: 'CUSTOMER',
    };

    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }
}
