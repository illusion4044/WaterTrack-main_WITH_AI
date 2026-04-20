require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Testing gemini-2.5-flash...');
console.log('✅ API Key:', apiKey.substring(0, 10) + '...');

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    console.log('🔄 Sending request...');

    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Say hello in Ukrainian'
        }]
      }]
    }, {
      timeout: 10000
    });

    const text = response.data.candidates[0].content.parts[0].text;

    console.log('\n🎉 SUCCESS!');
    console.log('Response:', text);

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

test();