import { Product } from './product.entity.js';

describe('Product Entity', () => {
  it('debe crear un producto válido pasando nombre, precio > 0 y stock >= 0', () => {
    const product = Product.create({
      name: 'Test Product',
      price: 1500,
      stock: 5,
    });

    expect(product.id).toBeDefined();
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(1500);
    expect(product.stock).toBe(5);
    expect(product.status).toBe('ACTIVE');
  });

  it('debe lanzar un Error si se intenta inicializar con precio negativo o nulo', () => {
    expect(() => {
      Product.create({ name: 'Test', price: 0, stock: 10 });
    }).toThrow('El precio debe ser mayor a cero');

    expect(() => {
      Product.create({ name: 'Test', price: -5, stock: 10 });
    }).toThrow('El precio debe ser mayor a cero');
  });

  it('debe lanzar un Error si se pasa un inventario (stock) negativo', () => {
    expect(() => {
      Product.create({ name: 'Test', price: 100, stock: -1 });
    }).toThrow('El stock no puede ser negativo');
  });

  it('debe retornar true en hasStock(qty) cuando qty < stock', () => {
    const product = Product.create({ name: 'Test', price: 100, stock: 10 });
    expect(product.hasStock(5)).toBe(true);
  });

  it('debe retornar true en hasStock(qty) cuando qty === stock', () => {
    const product = Product.create({ name: 'Test', price: 100, stock: 10 });
    expect(product.hasStock(10)).toBe(true);
  });

  it('debe retornar false en hasStock(qty) cuando qty > stock', () => {
    const product = Product.create({ name: 'Test', price: 100, stock: 10 });
    expect(product.hasStock(11)).toBe(false);
  });
});
