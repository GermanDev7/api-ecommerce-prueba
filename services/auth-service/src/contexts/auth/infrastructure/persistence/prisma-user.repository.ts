import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    };
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
  }
}
