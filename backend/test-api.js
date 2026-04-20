const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/');

    const user = await User.findOne({ username: 'Andriii' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '123456');
    console.log('✅ Generated token for user:', user.username);

    // Додамо воду
    console.log('🔄 Adding 300ml...');
    const addRes = await axios.post('http://localhost:5001/api/water',
      { amount: 300 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Add response:', addRes.data);

    // Отримаємо дані
    console.log('🔄 Getting water data...');
    const getRes = await axios.get('http://localhost:5001/api/water',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Get response: found', getRes.data.length, 'entries');

    // Покажемо останні 3 записи
    const recent = getRes.data.slice(0, 3);
    recent.forEach(entry => {
      console.log(`  - ${entry.amount}ml on ${new Date(entry.date).toLocaleDateString()}`);
    });

  } catch (err) {
    console.log('❌ Error:', err.response?.data || err.message);
  } finally {
    mongoose.disconnect();
  }
}

testAPI();