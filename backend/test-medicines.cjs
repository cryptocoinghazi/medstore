
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching medicines...');
  const medicines = await prisma.medicine.findMany();
  console.log('Medicines found:', medicines.length);
  if (medicines.length > 0) {
    console.log('First medicine:', medicines[0]);
  } else {
    console.log('No medicines found in database.');
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
