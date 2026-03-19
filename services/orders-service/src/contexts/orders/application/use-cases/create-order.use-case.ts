import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity.js';
import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { InvalidOrderError } from '../../domain/errors/order.errors.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';
import {
  PRODUCTS_SERVICE_CLIENT,
  type ProductsServiceClient,
} from '../ports/products-service.client.js';
import type { CreateOrderDto } from '../../presentation/dtos/create-order.dto.js';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCTS_SERVICE_CLIENT)
    private readonly productsClient: ProductsServiceClient,
  ) {}

  async execute(userId: string, dto: CreateOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productsClient.getProductDetails(
        itemDto.productId,
      );

      if (!product) {
        throw new InvalidOrderError(
          `El producto con ID ${itemDto.productId} no existe`,
        );
      }

      if (product.status !== 'ACTIVE') {
        throw new InvalidOrderError(
          `El producto con ID ${itemDto.productId} está inactivo`,
        );
      }

      if (product.stock < itemDto.quantity) {
        throw new InvalidOrderError(
          `Stock insuficiente para el producto ${itemDto.productId}. Disponible: ${product.stock}`,
        );
      }

      const orderItem = new OrderItem(
        itemDto.productId,
        itemDto.quantity,
        product.price,
      );
      orderItems.push(orderItem);
    }

    const order = Order.create(userId, orderItems);
    const savedOrder = await this.orderRepository.save(order);

    // Ejecutar deducción de stock asíncronamente (Fire and Forget)
    for (const itemDto of dto.items) {
      this.productsClient
        .deductStock(itemDto.productId, itemDto.quantity)
        .catch((err) => {
          console.error(`Error deduct stock side-effect:`, err);
        });
    }

    return savedOrder;
  }
}
