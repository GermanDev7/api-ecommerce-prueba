import { Inject, Injectable } from '@nestjs/common';
import type { Order } from '../../domain/entities/order.entity.js';
import { OrderNotFoundError } from '../../domain/errors/order.errors.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/repositories/order.repository.js';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundError(`Order with ID ${id} not found`);
    }
    return order;
  }
}
