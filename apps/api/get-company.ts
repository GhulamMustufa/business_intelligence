const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('SELECT id FROM "Company" LIMIT 1');
  console.log(res.rows[0].id);
  await client.end();
}
run();
