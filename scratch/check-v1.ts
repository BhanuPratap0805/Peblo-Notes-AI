import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testV1() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
    const result = await model.generateContent('ping');
    console.log('v1 SUCCESS');
  } catch (e) {
    console.log('v1 FAILED - ' + e.message);
  }
}

testV1();
