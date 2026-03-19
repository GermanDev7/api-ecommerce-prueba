import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User valid email address',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Dr. German' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'password123', description: 'Strong password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
