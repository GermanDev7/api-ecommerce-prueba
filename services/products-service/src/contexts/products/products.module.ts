import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/prisma.service.js';
import { PrismaProductRepository } from './infrastructure/persistence/prisma-product.repository.js';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { DeductStockUseCase } from './application/use-cases/deduct-stock.use-case.js';
import { ProductController } from './presentation/controllers/product.controller.js';

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,

    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    DeductStockUseCase,
  ],
  exports: [PrismaService],
})
export class ProductsModule {}
