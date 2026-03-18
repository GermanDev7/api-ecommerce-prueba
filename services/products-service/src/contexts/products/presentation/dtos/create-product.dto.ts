import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Pro 14', description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'High-performance laptop', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1299.99, description: 'Product price (must be positive)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock (must be >= 0)' })
  @IsInt()
  @Min(0)
  stock: number;
}
