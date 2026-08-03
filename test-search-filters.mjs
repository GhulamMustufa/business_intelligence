async function test() {
  const login = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
  });
  const data = await login.json();
  const token = data.token || data.access_token;
  
  if (!token) {
    console.log('Login failed', data);
    return;
  }
  
  const searchUrl = 'http://localhost:3001/companies?search=plumber&locations=austin&industries=home+services&minEmployees=1&maxEmployees=50';
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
