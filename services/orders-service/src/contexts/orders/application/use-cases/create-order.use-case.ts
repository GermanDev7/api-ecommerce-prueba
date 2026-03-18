import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity.js';
import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { InvalidOrderError } from '../../domain/errors/order.errors.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/repositories/order.repository.js';
import { PRODUCTS_SERVICE_CLIENT, type ProductsServiceClient } from '../ports/products-service.client.js';
import type { CreateOrderDto } from '../../presentation/dtos/create-order.dto.js';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCTS_SERVICE_CLIENT)
    private readonly productsClient: ProductsServiceClient,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];

    // Inter-service transaction logic: Validate each product via HTTP before creating the order
    for (const itemDto of dto.items) {
      const product = await this.productsClient.getProductDetails(itemDto.productId);
      
      if (!product) {
        throw new InvalidOrderError(`Product with ID ${itemDto.productId} does not exist`);
      }

      if (product.status !== 'ACTIVE') {
        throw new InvalidOrderError(`Product with ID ${itemDto.productId} is inactive`);
      }

      if (product.stock < itemDto.quantity) {
        throw new InvalidOrderError(`Insufficient stock for product ${itemDto.productId}. Available: ${product.stock}`);
      }

      // We snap the current *unit price* from the Product API, ensuring the price is historically accurate when the order is made
      const orderItem = new OrderItem(itemDto.productId, itemDto.quantity, product.price);
      orderItems.push(orderItem);
    }

    const order = Order.create(orderItems);
    return this.orderRepository.save(order);
  }
}
