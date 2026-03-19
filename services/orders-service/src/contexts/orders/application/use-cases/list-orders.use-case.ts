import { Inject, Injectable } from '@nestjs/common';
import type { Order } from '../../domain/entities/order.entity.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Order[], number]> {
    const skip = (page - 1) * limit;
    return this.orderRepository.findAll(userId, skip, limit);
  }
}
