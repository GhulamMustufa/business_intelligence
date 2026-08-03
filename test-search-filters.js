const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './apps/api/.env' });

async function test() {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  // Create a fake token for a valid userId format (UUID)
  const token = jwt.sign({ sub: 'd48e8946-1896-414f-8fc2-a29eb4ed12e4', email: 'test@example.com' }, secret);
  
  const searchUrl = 'http://localhost:3001/companies?search=plumber&locations=austin,tx&industries=home+services';
  console.log(`Hitting ${searchUrl}`);
  
  const res = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const status = res.status;
  const text = await res.text();
  console.log('Status:', status);
  if (status !== 200) {
    console.log('Error:', text);
  } else {
    try {
      const data = JSON.parse(text);
      console.log(`Success! Found ${data.total} companies.`);
      if (data.items.length > 0) {
         console.log(data.items[0]);
      }
    } catch (e) {
      console.log('Parse error:', e, text);
    }
  }
}

test();
