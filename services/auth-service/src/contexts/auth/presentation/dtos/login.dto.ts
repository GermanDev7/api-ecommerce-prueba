import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User valid email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Strong password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
