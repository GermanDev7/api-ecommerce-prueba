const { PrismaClient } = require('@ecommerce/prisma-auth');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Administrando semillas de Auth...');

  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@ecommerce.com' }});
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email: 'admin@ecommerce.com',
        name: 'Admin Evaluador',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@ecommerce.com / admin123');
  } else {
    console.log('⏭️ Admin user already exists.');
  }

  const existingCustomer = await prisma.user.findUnique({ where: { email: 'customer@ecommerce.com' }});
  if (!existingCustomer) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('customer123', salt);
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email: 'customer@ecommerce.com',
        name: 'Cliente Evaluador',
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    console.log('✅ Customer user created: customer@ecommerce.com / customer123');
  } else {
    console.log('⏭️ Customer user already exists.');
  }

  console.log('🎉 Semillas de Auth completadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
