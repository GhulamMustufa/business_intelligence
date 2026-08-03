import 'dotenv/config';

async function test() {
  const params = new URLSearchParams({
    engine: 'google_local',
    q: 'software agencies in malaysia',
    api_key: process.env.SERPAPI_KEY,
    num: '1'
  });

  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const data = await response.json();
  console.log(JSON.stringify(data.local_results[0], null, 2));
}

test();
