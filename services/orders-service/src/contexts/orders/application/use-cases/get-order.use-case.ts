import { Inject, Injectable } from '@nestjs/common';
import type { Order } from '../../domain/entities/order.entity.js';
import { OrderNotFoundError } from '../../domain/errors/order.errors.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(userId: string, id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order || order.userId !== userId) {
      throw new OrderNotFoundError(`La orden con ID ${id} no fue encontrada`);
    }
    return order;
  }
}
