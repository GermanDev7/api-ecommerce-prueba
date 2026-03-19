import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
