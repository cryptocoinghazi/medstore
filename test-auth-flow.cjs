
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testAuth() {
  console.log('--- Starting Manual Test Simulation ---');

  // 1. Register
  const uniqueId = Date.now();
  const registerData = {
    mobile: `98${uniqueId.toString().slice(-8)}`,
    email: `test${uniqueId}@example.com`,
    name: `Test User ${uniqueId}`,
    role: 'patient',
    password: 'password123' // Not used in current backend logic but good to have
  };

  console.log(`\n1. Attempting Registration for ${registerData.name}...`);
  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    if (!regRes.ok) {
        const err = await regRes.text();
        throw new Error(`Registration failed: ${regRes.status} ${err}`);
    }
    const regJson = await regRes.json();
    console.log('✅ Registration Successful:', regJson);

    // 2. Login
    console.log(`\n2. Attempting Login for ${registerData.mobile}...`);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: registerData.mobile, otp: '1234', role: 'patient' })
    });

    if (!loginRes.ok) {
        const err = await loginRes.text();
        throw new Error(`Login failed: ${loginRes.status} ${err}`);
    }
    const loginJson = await loginRes.json();
    console.log('✅ Login Successful:', loginJson);
    const token = loginJson.token;

    // 3. Get Profile
    console.log(`\n3. Fetching Profile with Token...`);
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!profileRes.ok) {
        const err = await profileRes.text();
        throw new Error(`Profile fetch failed: ${profileRes.status} ${err}`);
    }
    const profileJson = await profileRes.json();
    console.log('✅ Profile Fetch Successful:', profileJson);
    console.log('\n--- Test Completed Successfully ---');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testAuth();
