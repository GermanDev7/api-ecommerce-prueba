import { Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity.js';
import type { ProductRepository } from '../../domain/repositories/product.repository.js';
import { PrismaService } from './prisma.service.js';
import { ProductMapper } from './mappers/product.mapper.js';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPersistence(product);
    const saved = await this.prisma.product.create({ data });
    return ProductMapper.toDomain(saved);
  }

  async findAll(skip?: number, take?: number): Promise<[Product[], number]> {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);
    return [products.map(ProductMapper.toDomain), total];
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async deductStock(id: string, quantity: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}
