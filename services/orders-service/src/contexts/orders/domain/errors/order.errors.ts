export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Order with id '${id}' not found`);
    this.name = 'OrderNotFoundError';
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidOrderError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
