import { CreateProductUseCase } from './create-product.use-case.js';
import { ProductRepository } from '../../domain/repositories/product.repository.js';
import { Product } from '../../domain/entities/product.entity.js';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateProductUseCase(mockRepository);
  });

  it('debe crear la entidad correctamente y llamar a productRepository.save()', async () => {
    const dto = { name: 'Test', price: 100, stock: 10 };
    mockRepository.save.mockImplementation(async (p) => p);

    await useCase.execute(dto);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    
    // Validar el objeto exacto que se pasó al repositorio
    const savedProduct = mockRepository.save.mock.calls[0][0];
    expect(savedProduct.name).toBe('Test');
    expect(savedProduct.price).toBe(100);
  });

  it('debe retornar el producto persistido por el repositorio', async () => {
    const dto = { name: 'Test Product', price: 50, stock: 5 };
    let savedProduct: Product;
    mockRepository.save.mockImplementation(async (p) => {
      savedProduct = p;
      return p;
    });

    const result = await useCase.execute(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Product');
    expect(result.price).toBe(50);
  });

  it('debe propagar errores del dominio cuando los datos son inválidos', async () => {
    const invalidDto = { name: 'Test', price: -10, stock: 5 };
    
    // Comprueba que el UseCase escupa el error sin tragarlo y no guarde nada
    await expect(useCase.execute(invalidDto)).rejects.toThrow('Price must be greater than zero');
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
