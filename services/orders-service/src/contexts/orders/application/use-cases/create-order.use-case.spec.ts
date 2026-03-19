import { CreateOrderUseCase } from './create-order.use-case.js';
import { OrderRepository } from '../../domain/repositories/order.repository.js';
import {
  ProductsServiceClient,
  ProductDetails,
} from '../ports/products-service.client.js';
import { InvalidOrderError } from '../../domain/errors/order.errors.js';
import { Order } from '../../domain/entities/order.entity.js';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockProductsClient: jest.Mocked<ProductsServiceClient>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    // El puerto inyectado para comunicarse con Productos
    mockProductsClient = {
      getProductDetails: jest.fn(),
      deductStock: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateOrderUseCase(mockOrderRepository, mockProductsClient);
  });

  const validProduct: ProductDetails = {
    id: 'prod-1',
    price: 150.0,
    stock: 10,
    status: 'ACTIVE',
  };

  it('consulta productsApiClient para validar que el producto existe', async () => {
    mockProductsClient.getProductDetails.mockResolvedValue(validProduct);
    mockOrderRepository.save.mockImplementation((o) =>
      Promise.resolve(o as any),
    );

    await useCase.execute('user-idx', {
      items: [{ productId: 'prod-1', quantity: 1 }],
    });

    expect(mockProductsClient.getProductDetails).toHaveBeenCalledWith('prod-1');
  });

  it('crea la orden y llama a orderRepository.save() cuando todos los productos son válidos', async () => {
    mockProductsClient.getProductDetails.mockResolvedValue(validProduct);
    mockOrderRepository.save.mockImplementation((o) =>
      Promise.resolve(o as any),
    );

    await useCase.execute('user-idx', {
      items: [{ productId: 'prod-1', quantity: 2 }],
    });

    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.save).toHaveBeenCalledWith(expect.any(Order));
  });

  it('rechaza la creación de la orden cuando un producto no existe, propagando una excepción equivalente a NotFound', async () => {
    // Simulamos que el API Client no encontró el producto
    mockProductsClient.getProductDetails.mockResolvedValue(null);

    await expect(
      useCase.execute('user-idx', {
        items: [{ productId: 'ghost-prod', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidOrderError);

    expect(mockOrderRepository.save).not.toHaveBeenCalled();
  });

  it('lanza InvalidOrderError si alguna cantidad excede el stock', async () => {
    mockProductsClient.getProductDetails.mockResolvedValue({
      ...validProduct,
      stock: 5, // Quedan 5 en stock
    });

    await expect(
      useCase.execute('user-idx', {
        items: [{ productId: 'prod-1', quantity: 6 }],
      }),
    ).rejects.toThrow(InvalidOrderError);

    await expect(
      useCase.execute('user-idx', {
        items: [{ productId: 'prod-1', quantity: 6 }],
      }),
    ).rejects.toThrow(
      'Stock insuficiente para el producto prod-1. Disponible: 5',
    );

    expect(mockOrderRepository.save).not.toHaveBeenCalled();
  });

  it('copia el precio actual del producto en unitPrice para preservar historial', async () => {
    mockProductsClient.getProductDetails.mockResolvedValue({
      ...validProduct,
      price: 99.99, // Precio actual bajó
    });
    mockOrderRepository.save.mockImplementation((o) =>
      Promise.resolve(o as any),
    );

    await useCase.execute('user-idx', {
      items: [{ productId: 'prod-1', quantity: 1 }],
    });

    const savedOrder = mockOrderRepository.save.mock.calls[0][0];
    const savedItem = savedOrder.items[0];

    expect(savedItem.unitPrice).toBe(99.99); // Preservado históricamente!
  });

  it('propaga un error técnico si productsApiClient falla por indisponibilidad del servicio', async () => {
    // Simulamos caída de la subred o 500 Interno
    mockProductsClient.getProductDetails.mockRejectedValue(
      new Error('El servicio de productos no está disponible'),
    );

    await expect(
      useCase.execute('user-idx', {
        items: [{ productId: 'prod-1', quantity: 1 }],
      }),
    ).rejects.toThrow('El servicio de productos no está disponible');

    expect(mockOrderRepository.save).not.toHaveBeenCalled();
  });

  it('crea correctamente órdenes con múltiples items válidos', async () => {
    mockProductsClient.getProductDetails.mockImplementation((id) => {
      if (id === 'prod-1')
        return Promise.resolve({
          id: 'prod-1',
          stock: 10,
          price: 100,
          status: 'ACTIVE',
        });
      if (id === 'prod-2')
        return Promise.resolve({
          id: 'prod-2',
          stock: 2,
          price: 50,
          status: 'ACTIVE',
        });
      return Promise.resolve(null);
    });
    mockOrderRepository.save.mockImplementation((o) =>
      Promise.resolve(o as any),
    );

    await useCase.execute('user-idx', {
      items: [
        { productId: 'prod-1', quantity: 5 },
        { productId: 'prod-2', quantity: 2 },
      ],
    });

    expect(mockProductsClient.getProductDetails).toHaveBeenCalledTimes(2);
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);

    const savedOrder = mockOrderRepository.save.mock.calls[0][0];
    expect(savedOrder.totalAmount).toBe(600); // 500 + 100
  });

  it('rechaza o lanza error cuando el request de una orden llega completamente vacía', async () => {
    await expect(useCase.execute('user-idx', { items: [] })).rejects.toThrow(
      InvalidOrderError,
    );

    expect(mockProductsClient.getProductDetails).not.toHaveBeenCalled();
    expect(mockOrderRepository.save).not.toHaveBeenCalled();
  });
});
