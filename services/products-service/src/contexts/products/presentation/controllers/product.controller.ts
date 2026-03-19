import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';
import { DeductStockUseCase } from '../../application/use-cases/deduct-stock.use-case.js';
import { CreateProductDto } from '../dtos/create-product.dto.js';
import { UpdateStockDto } from '../dtos/update-stock.dto.js';
import { JwtAuthGuard, PaginationDto } from '@ecommerce/shared';
import type { Product } from '../../domain/entities/product.entity.js';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly deductStockUseCase: DeductStockUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product (Requires Auth)' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponse> {
    const product = await this.createProductUseCase.execute(dto);
    return toResponse(product);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  async findAll(@Query() paginationDto: PaginationDto): Promise<{
    data: ProductResponse[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [products, total] = await this.listProductsUseCase.execute(
      page,
      limit,
    );
    return {
      data: products.map(toResponse),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponse> {
    const product = await this.getProductUseCase.execute(id);
    return toResponse(product);
  }

  @Patch(':id/stock')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  async deductStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ): Promise<void> {
    await this.deductStockUseCase.execute(id, dto.quantity);
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
