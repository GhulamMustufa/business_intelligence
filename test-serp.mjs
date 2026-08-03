import 'dotenv/config';
async function test() {
  const query = "software agencies in malaysia";
  const params = new URLSearchParams({
    engine: 'google_local',
    q: query,
    api_key: process.env.SERPAPI_KEY,
    num: '20'
  });
  console.log(`https://serpapi.com/search.json?${params.toString()}`);
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Local Results:", data.local_results ? data.local_results.length : 0);
  if (data.error) {
    console.error("Error:", data.error);
  }
}
test();
