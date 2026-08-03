async function test() {
  const login = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
  });
  const { token } = await login.json();
  const res = await fetch("http://localhost:3001/companies?search=software%20agencies%20in%20malaysia", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log(data);
}
test();
