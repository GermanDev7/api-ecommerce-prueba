import { Order as OrderEntity } from '../../../domain/entities/order.entity.js';
import { OrderItem as OrderItemEntity } from '../../../domain/entities/order-item.entity.js';
import type { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '../../../../../generated/prisma/index.js';

type PrismaOrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

export class OrderMapper {
  static toDomain(raw: PrismaOrderWithItems): OrderEntity {
    const items = raw.items.map((item) =>
      new OrderItemEntity(
        item.productId,
        item.quantity,
        Number(item.unitPrice),
        item.id,
      ),
    );

    return OrderEntity.reconstitute(
      {
        status: raw.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED',
        items,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPersistence(order: OrderEntity): PrismaOrderWithItems {
    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice as unknown as PrismaOrderItem['unitPrice'],
      })),
    };
  }
}
