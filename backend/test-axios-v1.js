require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Testing with v1 API...\n');
console.log('✅ Key:', apiKey.substring(0, 10) + '...');

async function test() {
  try {
    // ✅ Використовуємо v1 замість v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('🔄 Sending request...');
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Скажи привіт українською одним реченням'
        }]
      }]
    }, {
      timeout: 15000
    });
    
    const text = response.data.candidates[0].content.parts[0].text;
    
    console.log('\n🎉 SUCCESS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Response:', text);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ API працює! Тепер оновіть waterRoutes.js');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

test();