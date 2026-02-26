
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching orders...');
  const orders = await prisma.order.findMany();
  console.log('Orders found:', orders.length);
  if (orders.length > 0) {
    console.log('First order:', orders[0]);
  } else {
    console.log('No orders found in database.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
