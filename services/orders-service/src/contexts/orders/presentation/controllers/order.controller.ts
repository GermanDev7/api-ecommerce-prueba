import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case.js';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case.js';
import { CreateOrderDto } from '../dtos/create-order.dto.js';
import type { Order } from '../../domain/entities/order.entity.js';

@ApiTags('Orders')
@Controller('api/v1/orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or business rule violation (e.g., out of stock)' })
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponse> {
    // Controller just passes the DTO to the Application use case
    const order = await this.createOrderUseCase.execute(dto);
    return toResponse(order);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'Orders listed successfully' })
  async findAll(): Promise<{ data: OrderResponse[]; total: number }> {
    const orders = await this.listOrdersUseCase.execute();
    return { data: orders.map(toResponse), total: orders.length };
  }
}

// Data projection to keep domain entity private inside the service boundary
interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  createdAt: Date;
}

function toResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount, // Calculated by the domain entity
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    createdAt: order.createdAt,
  };
}
