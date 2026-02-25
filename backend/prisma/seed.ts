import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding medicines...');

  const medicines = [
    {
      name: 'Paracetamol 500mg',
      composition: 'Paracetamol',
      manufacturer: 'HealthCorp',
      category: 'Analgesic',
      base_price: 20.50,
      requires_prescription: false,
      dosage_info: { form: 'Tablet', pack_size: 10 },
    },
    {
      name: 'Amoxicillin 500mg',
      composition: 'Amoxicillin',
      manufacturer: 'PharmaPlus',
      category: 'Antibiotic',
      base_price: 85.00,
      requires_prescription: true,
      dosage_info: { form: 'Capsule', pack_size: 6 },
    },
    {
      name: 'Cetirizine 10mg',
      composition: 'Cetirizine Hydrochloride',
      manufacturer: 'AllergyAway',
      category: 'Antihistamine',
      base_price: 35.00,
      requires_prescription: false,
      dosage_info: { form: 'Tablet', pack_size: 10 },
    },
    {
      name: 'Ibuprofen 400mg',
      composition: 'Ibuprofen',
      manufacturer: 'PainRelief Inc',
      category: 'NSAID',
      base_price: 25.00,
      requires_prescription: false,
      dosage_info: { form: 'Tablet', pack_size: 15 },
    },
    {
      name: 'Metformin 500mg',
      composition: 'Metformin Hydrochloride',
      manufacturer: 'DiabetCare',
      category: 'Antidiabetic',
      base_price: 45.00,
      requires_prescription: true,
      dosage_info: { form: 'Tablet', pack_size: 20 },
    },
    {
      name: 'Atorvastatin 10mg',
      composition: 'Atorvastatin',
      manufacturer: 'HeartHealth',
      category: 'Statin',
      base_price: 120.00,
      requires_prescription: true,
      dosage_info: { form: 'Tablet', pack_size: 10 },
    },
     {
      name: 'Pantoprazole 40mg',
      composition: 'Pantoprazole',
      manufacturer: 'GastricCare',
      category: 'Antacid',
      base_price: 90.00,
      requires_prescription: true,
      dosage_info: { form: 'Tablet', pack_size: 10 },
    },
     {
      name: 'Vitamin C 500mg',
      composition: 'Ascorbic Acid',
      manufacturer: 'ImmunoBoost',
      category: 'Supplement',
      base_price: 150.00,
      requires_prescription: false,
      dosage_info: { form: 'Tablet', pack_size: 30 },
    }
  ];

  for (const med of medicines) {
    // Check if medicine already exists to avoid duplicates on re-runs
    const exists = await prisma.medicine.findFirst({
      where: { name: med.name }
    });

    if (!exists) {
        await prisma.medicine.create({
        data: med,
        });
        console.log(`Created ${med.name}`);
    } else {
        console.log(`Skipped ${med.name} (already exists)`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
