import { sign } from 'jsonwebtoken';
const token = sign({ sub: 'user-1', email: 'test@example.com' }, process.env.JWT_SECRET || 'super-secret');
console.log(token);
