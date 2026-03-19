import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product.repository.js';

@Injectable()
export class DeductStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`El producto con ID ${productId} no existe`);
    }

    await this.productRepository.deductStock(productId, quantity);
  }
}
