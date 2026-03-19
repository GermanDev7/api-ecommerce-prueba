const { PrismaClient } = require('@ecommerce/prisma-products');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Administrando semillas de Products...');

  const products = [
    { name: 'iPhone 15 Pro', description: 'Smartphone Apple de 256GB - Color Titanio', price: 4500000, stock: 50, status: 'ACTIVE' },
    { name: 'MacBook Air M3', description: 'Computador Portátil Apple de 512GB SSD', price: 5500000, stock: 20, status: 'ACTIVE' },
    { name: 'Sony WH-1000XM5', description: 'Audífonos Inalámbricos con Cancelación de Ruido', price: 1400000, stock: 100, status: 'ACTIVE' },
    { name: 'Samsung Galaxy S24', description: 'Smartphone Android de 128GB - Color Negro', price: 3800000, stock: 30, status: 'ACTIVE' },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          id: crypto.randomUUID(),
          ...p
        }
      });
      console.log(`✅ Product created: ${p.name}`);
    } else {
      console.log(`⏭️ Product already exists: ${p.name}`);
    }
  }

  console.log('🎉 Semillas de Products completadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
