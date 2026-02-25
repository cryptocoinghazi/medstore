
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testCart() {
  console.log('--- Testing Cart API ---');

  // 1. Login
  // Using a known user or create one
  const uniqueId = Date.now();
  const registerData = {
    mobile: `99${uniqueId.toString().slice(-8)}`, // distinct prefix
    email: `cart${uniqueId}@example.com`,
    name: `Cart User ${uniqueId}`,
    role: 'patient',
    password: 'password123'
  };

  console.log(`\n1. Registering/Logging in as ${registerData.name}...`);
  
  let authRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
  });

  if (authRes.ok) {
      console.log('Registration successful.');
  } else {
      console.log('Registration failed (likely exists). Proceeding to login...');
  }

  authRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        mobile: registerData.mobile,
        password: registerData.password
    })
  });
  
  let authData = await authRes.json();
  const token = authData.token || authData.access_token;

  if (!token) {
      console.error('Authentication failed:', authData);
      return;
  }
  console.log('Authentication successful.');

  // 2. Search for a medicine to add
  console.log('\n2. Finding a medicine...');
  const searchRes = await fetch(`${API_URL}/medicines/search?q=Paracetamol`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const medicines = await searchRes.json();
  
  if (medicines.length === 0) {
      console.error('No medicines found to add to cart.');
      return;
  }
  
  const medicineToAdd = medicines[0];
  console.log(`Selected: ${medicineToAdd.name} (ID: ${medicineToAdd.id})`);

  // 3. Add to Cart
  console.log('\n3. Adding to Cart...');
  const addRes = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
          medicineId: medicineToAdd.id,
          quantity: 2
      })
  });

  if (!addRes.ok) {
      console.error('Add to Cart failed:', await addRes.text());
  } else {
      const addedItem = await addRes.json();
      console.log('Added item:', addedItem);
  }

  // 3b. Add same item again (Test update logic)
  console.log('\n3b. Adding same item again (Update Quantity)...');
  const addRes2 = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
          medicineId: medicineToAdd.id,
          quantity: 1
      })
  });

  if (!addRes2.ok) {
      console.error('Add to Cart (Update) failed:', await addRes2.text());
  } else {
      const updatedItem = await addRes2.json();
      console.log('Updated item:', updatedItem);
  }

  // 4. Get Cart
  console.log('\n4. Fetching Cart...');
  const cartRes = await fetch(`${API_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!cartRes.ok) {
      console.error('Get Cart failed:', await cartRes.text());
  } else {
      const cart = await cartRes.json();
      console.log(`Cart Total: ${cart.totalAmount}`);
      console.log(`Items in cart: ${cart.items.length}`);
      cart.items.forEach(item => {
          console.log(`- ${item.medicine.name} x ${item.quantity} = ${item.medicine.base_price * item.quantity}`);
      });
  }
}

testCart().catch(console.error);
