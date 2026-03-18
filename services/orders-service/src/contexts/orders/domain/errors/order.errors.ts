export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Order with id '${id}' not found`);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderError';
  }
}
