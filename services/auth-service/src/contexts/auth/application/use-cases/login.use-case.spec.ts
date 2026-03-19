import { LoginUseCase } from './login.use-case.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}), { virtual: true });

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockRepository: jest.Mocked<UserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
    };
    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt_token_123'),
    } as any;
    
    useCase = new LoginUseCase(mockRepository, mockJwtService);
  });

  it('debe loguear exitosamente y retornar un accessToken y los datos del usuario', async () => {
    const mockUser = { id: 'user-1', email: 'test@test.com', passwordHash: 'hashedPwd', role: 'CUSTOMER' };
    mockRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await useCase.execute({ email: 'test@test.com', password: 'password' });

    expect(result.accessToken).toBe('jwt_token_123');
    expect(result.user.email).toBe('test@test.com');
  });

  it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'wrong@test.com', password: 'pwd' })).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute({ email: 'wrong@test.com', password: 'pwd' })).rejects.toThrow('Credenciales inválidas');
  });

  it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
    const mockUser = { id: 'user-1', email: 'test@test.com', passwordHash: 'hashedPwd', role: 'CUSTOMER' };
    mockRepository.findByEmail.mockResolvedValue(mockUser as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(useCase.execute({ email: 'test@test.com', password: 'wrongpwd' })).rejects.toThrow(UnauthorizedException);
  });
});
