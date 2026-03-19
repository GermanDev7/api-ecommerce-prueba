import { Injectable } from '@nestjs/common';
import type { Order } from '../../domain/entities/order.entity.js';
import type { OrderRepository } from '../../domain/repositories/order.repository.js';
import { PrismaService } from './prisma.service.js';
import { OrderMapper } from './mappers/order.mapper.js';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order);

    const saved = await this.prisma.order.create({
      data: {
        id: data.id,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        items: {
          create: data.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return OrderMapper.toDomain(saved);
  }

  async findAll(skip?: number, take?: number): Promise<[Order[], number]> {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);
    return [orders.map(OrderMapper.toDomain), total];
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return order ? OrderMapper.toDomain(order) : null;
  }
}
