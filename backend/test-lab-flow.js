async function testLabFlow() {
  const baseUrl = 'http://localhost:3001';
  let token = '';

  try {
    // 0. Register (if needed)
    console.log('Registering user...');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'John Doe',
            email: 'john.labtest@example.com',
            mobile: '1234567890',
            password: 'password123',
            role: 'patient',
            is_verified: true
        })
    });
    
    if (registerRes.ok) {
        console.log('Registration successful');
    } else {
        console.log('User might already exist, proceeding to login...');
    }

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: '1234567890',
        otp: '123456', // Mock OTP
        role: 'patient'
      })
    });
    
    if (!loginRes.ok) {
        const errorText = await loginRes.text();
        throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText} - ${errorText}`);
    }

    const loginData = await loginRes.json();
    token = loginData.token; // Changed from access_token to token
    console.log('Login successful');

    // 2. Get Lab Tests
    console.log('Fetching lab tests...');
    const testsRes = await fetch(`${baseUrl}/lab-tests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const tests = await testsRes.json();
    console.log(`Found ${tests.length} lab tests`);
    
    if (tests.length === 0) {
        console.error('No lab tests found. Seeding might have failed.');
        return;
    }

    const testId = tests[0].id;
    console.log(`Booking test: ${tests[0].name} (${testId})`);

    // 3. Book Test
    const bookingRes = await fetch(`${baseUrl}/lab-tests/book`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
            test_id: testId,
            booking_date: '2023-12-01',
            time_slot: '2023-12-01T10:00:00.000Z',
            home_collection: true,
            address: { street: '123 Main St' }
        })
    });
    
    if (!bookingRes.ok) {
        throw new Error(`Booking failed: ${bookingRes.status} ${bookingRes.statusText}`);
    }
    
    const bookingData = await bookingRes.json();
    console.log('Booking successful:', bookingData);

    // 4. Get My Bookings
    console.log('Fetching my bookings...');
    const myBookingsRes = await fetch(`${baseUrl}/lab-tests/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const myBookings = await myBookingsRes.json();
    console.log(`Found ${myBookings.length} bookings`);
    console.log('First booking status:', myBookings[0].status);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLabFlow();