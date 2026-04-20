require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Testing updated Gemini models...');
console.log('✅ API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET');

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

async function testModel(model) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log(`\n🔄 Testing ${model}...`);

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

    console.log(`✅ ${model} works!`);
    console.log('Response:', text);
    return true;

  } catch (err) {
    console.error(`❌ ${model} failed:`, err.response?.data?.error?.message || err.message);
    return false;
  }
}

async function test() {
  const models = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite'];

  for (const model of models) {
    const success = await testModel(model);
    if (success) {
      console.log(`\n🎉 Found working model: ${model}`);
      console.log('You can use this model in waterRoutes.js');
      break;
    }
  }
}

test();