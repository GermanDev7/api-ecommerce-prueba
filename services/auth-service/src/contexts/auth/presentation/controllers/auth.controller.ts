import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUseCase } from '../../application/use-cases/register.use-case.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { RegisterDto } from '../dtos/register.dto.js';
import { LoginDto } from '../dtos/login.dto.js';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUseCase.execute(dto);
    return { data: user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Generates access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const tokens = await this.loginUseCase.execute(dto);
    return { data: tokens };
  }
}
