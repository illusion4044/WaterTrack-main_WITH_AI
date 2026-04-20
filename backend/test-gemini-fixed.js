require('dotenv').config();

// Використовуємо undici замість стандартного fetch
const { fetch } = require('undici');
global.fetch = fetch;

const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('🧪 Testing with undici fetch...\n');

const apiKey = process.env.GEMINI_API_KEY;
console.log('✅ Key:', apiKey.substring(0, 10) + '...');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('🔄 Sending request...');
    const result = await model.generateContent('Скажи привіт українською');
    const response = await result.response;
    const text = response.text();
    
    console.log('\n🎉 SUCCESS!');
    console.log('Response:', text);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
  }
}

test();