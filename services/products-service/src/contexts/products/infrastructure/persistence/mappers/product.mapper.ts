import type { Product } from '../../domain/entities/product.entity.js';
import type { Product as PrismaProduct } from '@prisma/client';
import { Product as ProductEntity } from '../../domain/entities/product.entity.js';

export class ProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return ProductEntity.reconstitute(
      {
        name: raw.name,
        description: raw.description ?? undefined,
        price: Number(raw.price),
        stock: raw.stock,
        status: raw.status as 'ACTIVE' | 'INACTIVE',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPersistence(product: Product): Omit<PrismaProduct, never> {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      price: product.price as unknown as PrismaProduct['price'],
      stock: product.stock,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
