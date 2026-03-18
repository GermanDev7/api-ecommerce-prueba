import { OrderItem } from './order-item.entity.js';
import { InvalidOrderError } from '../errors/order.errors.js';

import { OrderStatus } from '../enums/order-status.enum.js';

export interface OrderProps {
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  private readonly _id: string;
  private readonly props: OrderProps;

  private constructor(props: OrderProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }

  static create(items: OrderItem[]): Order {
    if (!items || items.length === 0) {
      throw new InvalidOrderError('An order must contain at least one item');
    }

    return new Order({
      status: 'PENDING',
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: OrderProps, id: string): Order {
    return new Order(props, id);
  }

  get id(): string { return this._id; }
  get status(): OrderStatus { return this.props.status; }
  get items(): ReadonlyArray<OrderItem> { return this.props.items; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  get totalAmount(): number {
    const total = this.props.items.reduce((sum, item) => sum + item.subtotal, 0);
    return Math.round(total * 100) / 100;
  }

  confirm(): void {
    if (this.props.status !== 'PENDING') {
      throw new InvalidOrderError('Only pending orders can be confirmed');
    }
    this.props.status = 'CONFIRMED';
    this.props.updatedAt = new Date();
  }
}
