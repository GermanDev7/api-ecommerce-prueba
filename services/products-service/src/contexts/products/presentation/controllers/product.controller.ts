import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import type { Product } from '../../domain/entities/product.entity.js';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponse> {
    const product = await this.createProductUseCase.execute(dto);
    return toResponse(product);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  async findAll(): Promise<{ data: ProductResponse[]; total: number }> {
    const products = await this.listProductsUseCase.execute();
    return { data: products.map(toResponse), total: products.length };
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponse> {
    const product = await this.getProductUseCase.execute(id);
    return toResponse(product);
  }
}

interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  createdAt: Date;
}

function toResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    status: product.status,
    createdAt: product.createdAt,
  };
}
