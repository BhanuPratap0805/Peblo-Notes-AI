import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listAllModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // In @google/generative-ai, there is no direct listModels on genAI.
    // We usually have to use a different client or just brute force common names.
    // However, some versions have it. Let's try to see if we can find it.
    
    // Alternative: Try 'gemini-pro' (1.0)
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-2.0-flash-exp'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent('ping');
        console.log(`Model ${m}: SUCCESS`);
      } catch (e) {
        console.log(`Model ${m}: FAILED - ${e.message}`);
      }
    }
  } catch (e) {
    console.error('List models failed:', e);
  }
}

listAllModels();
