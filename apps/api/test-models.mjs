import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Wait, there's no listModels in the SDK directly without a REST call.
  // I will just use fetch to hit the REST API directly.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await response.json();
  if (data.models) {
    data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
  } else {
    console.log(data);
  }
}
test();
