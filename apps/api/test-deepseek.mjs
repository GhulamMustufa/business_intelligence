import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

async function main() {
  console.log('Testing DeepSeek API...');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Output JSON matching { "status": "ok" }.' },
        { role: 'user', content: 'Say hello!' }
      ],
      response_format: { type: 'json_object' }
    });
    
    console.log('Success! Response:', response.choices[0].message.content);
  } catch (err) {
    console.error('Failed:', err);
  }
}

main();
