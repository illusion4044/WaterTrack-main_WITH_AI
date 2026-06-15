const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const waterRoutes = require('./routes/waterRoutes');
const path = require('path');

// .env
dotenv.config();

// console.logи щоб побачити чи завантажився ключ
console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY.substring(0, 15) + '...');
} else {
  console.log('GEMINI_API_KEY is missing!');
}
console.log('');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';
connectDB(MONGO);

app.use('/api/users', userRoutes);
app.use('/api/water', waterRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));