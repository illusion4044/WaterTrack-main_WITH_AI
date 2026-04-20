require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Testing Gemini 2.5 Flash...\n');
console.log('✅ Key:', apiKey.substring(0, 10) + '...\n');

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    console.log('🔄 Sending request to Gemini 2.5...');
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Скажи привіт українською одним реченням'
        }]
      }]
    }, {
      timeout: 10000
    });
    
    const text = response.data.candidates[0].content.parts[0].text;
    
    console.log('\n🎉 SUCCESS with Gemini 2.5!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Response:', text);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Gemini 2.5 працює! Можна використовувати в waterRoutes.js');
    
  } catch (err) {
    console.error('\n❌ Gemini 2.5 не працює');
    console.error('Error:', err.message);
    
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
      
      if (err.response.status === 404) {
        console.log('\n💡 Модель gemini-2.0-flash-exp недоступна');
        console.log('   Спробуємо gemini-1.5-flash...\n');
        
        // Fallback на 1.5
        await testFallback();
      }
    }
  }
}

async function testFallback() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    console.log('🔄 Testing gemini-1.5-flash...');
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Скажи привіт українською'
        }]
      }]
    }, {
      timeout: 10000
    });
    
    const text = response.data.candidates[0].content.parts[0].text;
    
    console.log('\n🎉 SUCCESS with Gemini 1.5 Flash!');
    console.log('Response:', text);
    console.log('\n✅ Використовуй gemini-1.5-flash в waterRoutes.js');
    
  } catch (err) {
    console.error('\n❌ gemini-1.5-flash теж не працює');
    console.error('Error:', err.response?.data || err.message);
    console.log('\n💡 Рекомендую використати Mock AI в waterRoutes.js');
  }
}

test();