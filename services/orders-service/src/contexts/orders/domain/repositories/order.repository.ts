import type { Order } from '../entities/order.entity.js';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
