require('dotenv').config();

const https = require('https');

const apiKey = process.env.GEMINI_API_KEY;

console.log('🧪 Simple API Test...');
console.log('✅ API Key:', apiKey.substring(0, 10) + '...');

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: "Say hello in Ukrainian"
    }]
  }]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔄 Sending request...');

const req = https.request(url, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);
      
      if (json.error) {
        console.error('❌ API Error:', json.error.message);
      } else {
        const text = json.candidates[0].content.parts[0].text;
        console.log('🎉 SUCCESS!');
        console.log('Response:', text);
      }
    } catch (err) {
      console.error('❌ Parse error:', err.message);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  
  if (error.code === 'ENOTFOUND') {
    console.log('💡 DNS lookup failed - check internet connection');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('💡 Connection refused - check firewall');
  }
});

req.write(data);
req.end();