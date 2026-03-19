import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity.js';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product.repository.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(
        `El producto con ID ${id} no fue encontrado`,
      );
    }
    return product;
  }
}
