require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Testing Gemini API with axios...\n');
console.log('1️⃣ Checking API Key...');
console.log('✅ Key found:', apiKey ? apiKey.substring(0, 10) + '...' : '❌ MISSING');

if (!apiKey) {
  console.error('❌ No API key found!');
  process.exit(1);
}

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('\n2️⃣ Sending request to Gemini API...');
    console.log('URL:', url.substring(0, 80) + '...');
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Скажи привіт українською одним реченням'
        }]
      }]
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Response received!');
    console.log('Status:', response.status);
    
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const text = response.data.candidates[0].content.parts[0].text;
      
      console.log('\n🎉 SUCCESS! Gemini працює через axios!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Response:', text);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✅ Тепер можна використати axios в waterRoutes.js!');
    } else {
      console.log('❌ Unexpected response format');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (err) {
    console.error('\n❌ Request FAILED!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    
    if (err.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused');
      console.log('   Можливі причини:');
      console.log('   - Firewall блокує Node.js');
      console.log('   - Антивірус блокує запити');
      console.log('   ');
      console.log('   Спробуй:');
      console.log('   1. Додати Node.js в Windows Firewall');
      console.log('   2. Тимчасово вимкнути антивірус');
      console.log('   3. Підключитись до іншої мережі');
      
    } else if (err.code === 'ENOTFOUND') {
      console.log('\n💡 DNS lookup failed');
      console.log('   Можливі причини:');
      console.log('   - Немає інтернету');
      console.log('   - DNS проблема');
      console.log('   ');
      console.log('   Спробуй:');
      console.log('   ping google.com');
      
    } else if (err.code === 'ETIMEDOUT') {
      console.log('\n💡 Request timeout');
      console.log('   Можливі причини:');
      console.log('   - Повільний інтернет');
      console.log('   - Firewall затримує запити');
      
    } else if (err.response) {
      console.log('\n💡 API Error');
      console.log('   Status:', err.response.status);
      console.log('   Data:', JSON.stringify(err.response.data, null, 2));
      
      if (err.response.status === 400) {
        console.log('\n   Можливо невірний формат запиту');
      } else if (err.response.status === 403) {
        console.log('\n   Можливо невірний API key');
      } else if (err.response.status === 404) {
        console.log('\n   Модель не знайдена');
      }
      
    } else {
      console.log('\n💡 Unknown error');
      console.log('   Full error:', err);
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

test();