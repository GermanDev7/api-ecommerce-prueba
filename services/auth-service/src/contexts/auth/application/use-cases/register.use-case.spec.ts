import { RegisterUseCase } from './register.use-case.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('randomSalt'),
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true),
}), { virtual: true });

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
    };
    useCase = new RegisterUseCase(mockRepository);
  });

  it('debe registrar un usuario exitosamente', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.save.mockImplementation(() => Promise.resolve());

    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'password',
      name: 'Test',
    });

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(result.email).toBe('test@test.com');
  });

  it('debe lanzar ConflictException si el email ya existe', async () => {
    mockRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', passwordHash: 'hash', role: 'CUSTOMER', createdAt: new Date(), updatedAt: new Date() } as any);

    await expect(
      useCase.execute({ email: 'test@test.com', password: 'pwd' }),
    ).rejects.toThrow(ConflictException);
    await expect(
      useCase.execute({ email: 'test@test.com', password: 'pwd' }),
    ).rejects.toThrow('El usuario con este correo electrónico ya existe');
  });
});
