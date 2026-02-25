const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testMedicines() {
  console.log('--- Testing Medicines API ---');

  // 1. Register/Login
  const uniqueId = Date.now();
  const registerData = {
    mobile: `98${uniqueId.toString().slice(-8)}`,
    email: `test${uniqueId}@example.com`,
    name: `Test User ${uniqueId}`,
    role: 'patient',
    password: 'password123'
  };

  console.log(`\n1. Registering/Logging in as ${registerData.name}...`);
  
  // Try registering
  let authRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
  });

  let authData = await authRes.json();
  
  if (authRes.ok) {
      console.log('Registration successful. Proceeding to login...');
  } else {
      console.log('Registration failed (likely exists). Proceeding to login...');
  }

  // Always login to get token
  authRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        mobile: registerData.mobile,
        password: registerData.password
    })
  });
  
  authData = await authRes.json();
  const token = authData.token || authData.access_token;

  if (!token) {
      console.error('Authentication failed:', authData);
      return;
  }

  console.log('Authentication successful, token received.');

  // 2. Search Medicines
  console.log('\n2. Searching for "Paracetamol"...');
  const searchRes = await fetch(`${API_URL}/medicines/search?q=Paracetamol`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!searchRes.ok) {
    console.error('Search failed:', await searchRes.text());
  } else {
    const medicines = await searchRes.json();
    console.log(`Found ${medicines.length} medicines matching "Paracetamol":`);
    medicines.forEach(m => console.log(`- ${m.name} (${m.composition})`));
  }

  // 3. List All Medicines
  console.log('\n3. Listing all medicines...');
  const allRes = await fetch(`${API_URL}/medicines`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!allRes.ok) {
      console.error('List failed:', await allRes.text());
    } else {
      const allMedicines = await allRes.json();
      console.log(`Total medicines: ${allMedicines.length}`);
      if (allMedicines.length === 0) {
          console.warn('Warning: No medicines found. Seeding might have failed.');
      }
    }
}

testMedicines().catch(console.error);
