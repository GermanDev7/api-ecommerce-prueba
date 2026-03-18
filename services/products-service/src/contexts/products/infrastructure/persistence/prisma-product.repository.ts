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

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }
}
