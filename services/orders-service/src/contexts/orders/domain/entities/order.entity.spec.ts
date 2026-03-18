import { OrderItem } from './order-item.entity.js';
import { Order } from './order.entity.js';
import { InvalidOrderError } from '../errors/order.errors.js';

describe('Order & OrderItem Entities', () => {
  describe('OrderItem', () => {
    it('crea un OrderItem válido con productId, quantity y unitPrice', () => {
      const item = new OrderItem('prod-1', 2, 50.5);
      expect(item.productId).toBe('prod-1');
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toBe(50.5);
      expect(item.subtotal).toBe(101);
    });

    it('lanza error si quantity <= 0', () => {
      expect(() => new OrderItem('prod-1', 0, 50)).toThrow(
        'Quantity must be greater than zero',
      );
      expect(() => new OrderItem('prod-1', -5, 50)).toThrow(
        'Quantity must be greater than zero',
      );
    });

    it('lanza error si unitPrice < 0', () => {
      // El dominio restringe < 0, precio 0 está permitido para regalos/cupones 100%
      expect(() => new OrderItem('prod-1', 1, -10)).toThrow(
        'Unit price cannot be negative',
      );
    });
  });

  describe('Order', () => {
    it('crea una orden nueva con estado PENDING', () => {
      const items = [new OrderItem('prod-1', 1, 100)];
      const order = Order.create(items);

      expect(order.status).toBe('PENDING');
      expect(order.items.length).toBe(1);
    });

    it('calcula correctamente el total a partir de sus items', () => {
      const items = [
        new OrderItem('prod-1', 2, 100), // 200
        new OrderItem('prod-2', 1, 50.5), // 50.5
      ];
      const order = Order.create(items);

      expect(order.totalAmount).toBe(250.5);
    });

    it('lanza error o rechaza órdenes vacías sin items', () => {
      expect(() => Order.create([])).toThrow(InvalidOrderError);
      expect(() => Order.create([])).toThrow(
        'An order must contain at least one item',
      );
    });
  });
});
