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

  console.log('Seeding doctors...');
  const doctors = [
    {
      name: 'Dr. Emily Carter',
      email: 'emily.carter@example.com',
      mobile: '9876543210',
      specialty: 'Cardiologist',
      license_number: 'MD12345',
      experience_years: 12,
      qualifications: { degree: 'MBBS, MD', university: 'Harvard Medical School' },
      consultation_fee: 1500.00,
    },
    {
      name: 'Dr. James Wilson',
      email: 'james.wilson@example.com',
      mobile: '9876543211',
      specialty: 'Dermatologist',
      license_number: 'MD12346',
      experience_years: 8,
      qualifications: { degree: 'MBBS, MD', university: 'Stanford University' },
      consultation_fee: 1000.00,
    },
    {
      name: 'Dr. Sarah Lee',
      email: 'sarah.lee@example.com',
      mobile: '9876543212',
      specialty: 'Pediatrician',
      license_number: 'MD12347',
      experience_years: 15,
      qualifications: { degree: 'MBBS, DCH', university: 'Johns Hopkins University' },
      consultation_fee: 1200.00,
    },
    {
      name: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      mobile: '9876543213',
      specialty: 'Neurologist',
      license_number: 'MD12348',
      experience_years: 20,
      qualifications: { degree: 'MBBS, DM', university: 'UCSF' },
      consultation_fee: 2000.00,
    }
  ];

  for (const doc of doctors) {
    const exists = await prisma.user.findFirst({
        where: { email: doc.email }
    });

    if (!exists) {
        const user = await prisma.user.create({
            data: {
                name: doc.name,
                email: doc.email,
                mobile: doc.mobile,
                role: 'doctor',
                is_verified: true,
            }
        });

        await prisma.doctor.create({
            data: {
                user_id: user.id,
                specialty: doc.specialty,
                license_number: doc.license_number,
                experience_years: doc.experience_years,
                qualifications: doc.qualifications as any,
                consultation_fee: doc.consultation_fee,
            }
        });
        console.log(`Created doctor ${doc.name}`);
    } else {
        console.log(`Skipped doctor ${doc.name} (already exists)`);
    }
  }

  console.log('Seeding labs...');
  const labs = [
    {
      name: 'MediLab Diagnostics',
      email: 'info@medilab.com',
      mobile: '9876543220',
      license_number: 'LAB12345',
      gst_number: 'GSTLAB12345',
      address: { street: '123 Lab St', city: 'Mumbai', state: 'MH', zip: '400001' },
      tests: [
        { name: 'Complete Blood Count (CBC)', price: 500, duration_hours: 24, description: 'Measures different components of blood.' },
        { name: 'Thyroid Profile', price: 800, duration_hours: 24, description: 'T3, T4, TSH levels.' },
        { name: 'Diabetes Screen (HbA1c)', price: 600, duration_hours: 12, description: 'Average blood sugar over past 3 months.' },
        { name: 'Vitamin D Total', price: 1200, duration_hours: 48, description: 'Checks Vitamin D levels.' }
      ]
    },
    {
      name: 'HealthCheck PathLabs',
      email: 'contact@healthcheck.com',
      mobile: '9876543221',
      license_number: 'LAB12346',
      gst_number: 'GSTLAB12346',
      address: { street: '456 Health Ave', city: 'Delhi', state: 'DL', zip: '110001' },
      tests: [
        { name: 'Lipid Profile', price: 700, duration_hours: 24, description: 'Cholesterol and triglycerides.' },
        { name: 'Liver Function Test (LFT)', price: 900, duration_hours: 24, description: 'Checks liver health.' },
        { name: 'Kidney Function Test (KFT)', price: 900, duration_hours: 24, description: 'Checks kidney health.' },
        { name: 'COVID-19 RT-PCR', price: 1500, duration_hours: 12, description: 'Detects SARS-CoV-2.' }
      ]
    }
  ];

  for (const lab of labs) {
      const exists = await prisma.user.findFirst({ where: { email: lab.email } });
      if (!exists) {
          const user = await prisma.user.create({
              data: {
                  name: lab.name,
                  email: lab.email,
                  mobile: lab.mobile,
                  role: 'diagnostic',
                  is_verified: true,
                  address: lab.address as any
              }
          });

          const diagnosticLab = await prisma.diagnosticLab.create({
              data: {
                  user_id: user.id,
                  lab_name: lab.name,
                  license_number: lab.license_number,
                  gst_number: lab.gst_number,
                  address: lab.address as any,
                  is_verified: true
              }
          });

          for (const test of lab.tests) {
              await prisma.labTest.create({
                  data: {
                      lab_id: diagnosticLab.id,
                      name: test.name,
                      description: test.description,
                      price: test.price,
                      duration_hours: test.duration_hours,
                      is_available: true,
                      home_collection: true
                  }
              });
          }
          console.log(`Created lab ${lab.name} with ${lab.tests.length} tests`);
      } else {
          console.log(`Skipped lab ${lab.name} (already exists)`);
      }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
