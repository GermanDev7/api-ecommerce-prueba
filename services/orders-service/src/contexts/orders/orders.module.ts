import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from './infrastructure/persistence/prisma.service.js';
import { PrismaOrderRepository } from './infrastructure/persistence/prisma-order.repository.js';
import { HttpProductsApiClient } from './infrastructure/http/products-api.client.js';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.js';
import { PRODUCTS_SERVICE_CLIENT } from './application/ports/products-service.client.js';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case.js';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case.js';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case.js';
import { OrderController } from './presentation/controllers/order.controller.js';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [
    PrismaService,

    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },

    {
      provide: PRODUCTS_SERVICE_CLIENT,
      useClass: HttpProductsApiClient,
    },
    CreateOrderUseCase,
    ListOrdersUseCase,
    GetOrderUseCase,
  ],
  exports: [PrismaService],
})
export class OrdersModule {}
