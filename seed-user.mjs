async function test() {
  const signup = await fetch('http://localhost:3001/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' })
  });
  const data = await signup.json();
  console.log(data);
}
test();
