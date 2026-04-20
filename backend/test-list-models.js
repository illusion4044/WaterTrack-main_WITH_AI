require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🔍 Listing available models...\n');

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    const response = await axios.get(url, { timeout: 10000 });
    
    console.log('✅ Available models:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    response.data.models.forEach(model => {
      console.log('📦 Model:', model.name);
      console.log('   Display:', model.displayName);
      console.log('   Methods:', model.supportedGenerationMethods.join(', '));
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) {
      console.error('Data:', err.response.data);
    }
  }
}


