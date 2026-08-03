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
  
  console.log('Got token');
  
  const metrics = await fetch('http://localhost:3001/dashboard/metrics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const status = metrics.status;
  const text = await metrics.text();
  console.log('Status:', status);
  console.log('Response:', text);
}

test();
