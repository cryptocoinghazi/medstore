import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres.zwvnokpyrvhagvqyaspx:AfifaDaniyal8092@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
});

async function testConnection() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConnection();
