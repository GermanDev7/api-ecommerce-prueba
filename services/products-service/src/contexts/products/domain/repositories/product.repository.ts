import type { Product } from '../entities/product.entity.js';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findAll(skip?: number, take?: number): Promise<[Product[], number]>;
  findById(id: string): Promise<Product | null>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
