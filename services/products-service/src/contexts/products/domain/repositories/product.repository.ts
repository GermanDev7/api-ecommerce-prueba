import type { Product } from '../entities/product.entity.js';

// Puerto de salida (Output Port): define el contrato que la capa de infraestructura debe implementar.
// La capa de dominio/aplicación solo conoce esta interfaz, nunca Prisma directamente.
export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}

// Token de inyección de dependencias para NestJS
export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
