import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case.js';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case.js';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case.js';
import { CreateOrderDto } from '../dtos/create-order.dto.js';
import { PaginationDto } from '@ecommerce/shared';
import type { Order } from '../../domain/entities/order.entity.js';

@ApiTags('Orders')
@Controller('api/v1/orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data or business rule violation (e.g., out of stock)',
  })
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponse> {
    const order = await this.createOrderUseCase.execute(dto);
    return toResponse(order);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'Orders listed successfully' })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: OrderResponse[]; total: number; page: number; lastPage: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [orders, total] = await this.listOrdersUseCase.execute(page, limit);
    return {
      data: orders.map(toResponse),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<OrderResponse> {
    const order = await this.getOrderUseCase.execute(id);
    return toResponse(order);
  }
}

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
    totalAmount: order.totalAmount,
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
