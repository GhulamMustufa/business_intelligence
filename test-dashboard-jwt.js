const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './apps/api/.env' });

async function test() {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  // Create a fake token for a valid userId format (UUID)
  const token = jwt.sign({ sub: 'd48e8946-1896-414f-8fc2-a29eb4ed12e4', email: 'test@example.com' }, secret);
  
  const metrics = await fetch('http://localhost:3001/dashboard/metrics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const status = metrics.status;
  const text = await metrics.text();
  console.log('Status:', status);
  console.log('Response:', text);
}

test();
