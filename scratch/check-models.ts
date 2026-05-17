import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // There is no listModels in the client SDK usually, let's just try gemini-1.5-flash again
    // with gemini-1.5-flash-latest or gemini-2.0-flash-exp
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash success:', result.response.text());
  } catch (e) {
    console.error('gemini-1.5-flash failed:', e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent('Hi');
    console.log('gemini-1.5-flash-latest success:', result.response.text());
  } catch (e) {
    console.error('gemini-1.5-flash-latest failed:', e.message);
  }
}

listModels();
