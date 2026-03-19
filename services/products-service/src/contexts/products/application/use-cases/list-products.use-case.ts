import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product.repository.js';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10): Promise<[Product[], number]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findAll(skip, limit);
  }
}
