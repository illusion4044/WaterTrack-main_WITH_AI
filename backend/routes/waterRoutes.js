const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { add, getAll, update } = require('../controllers/waterController');
const axios = require('axios');



router.post('/', auth, add);
router.get('/', auth, getAll);
router.put('/:id', auth, update);

// AI-компаньйон
router.post('/advice', auth, async (req, res) => {

  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('\n AI Request');
  console.log('API Key exists:', !!apiKey);
  console.log('User:', req.user?.username);
  console.log('Message:', req.body.message);
  
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Потрібне повідомлення" });
  }

  // Отримання даних про воду користувача
  let waterData = null;
  try {
    const WaterEntry = require('../models/WaterEntry');
    const entries = await WaterEntry.find({ user: req.user._id }).sort({ date: -1 });
    
    // Групування по датах
    const grouped = entries.reduce((acc, entry) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + entry.amount;
      return acc;
    }, {});
    
    // Отримуємо сьогоднішні та минулі дати
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Групування по місяцях для статистики
    const monthlyStats = entries.reduce((acc, entry) => {
      const d = new Date(entry.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, days: new Set() };
      }
      acc[monthKey].total += entry.amount;
      acc[monthKey].days.add(d.toISOString().split('T')[0]);
      return acc;
    }, {});
    

    const monthlySummary = Object.entries(monthlyStats).map(([month, data]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                         'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
      return `${monthNames[parseInt(monthNum) - 1]} ${year}: ${data.total} мл (${data.days.size} днів)`;
    }).join(', ');
    // Формування об'єкта для AI
    waterData = {
      today: grouped[today] || 0,
      yesterday: grouped[yesterday] || 0,
      totalEntries: entries.length,
      goal: 2000, 
      monthlySummary,
      recentEntries: entries.slice(0, 10).map(e => ({
        amount: e.amount,
        date: new Date(e.date).toLocaleDateString('uk-UA')
      }))
    };
    
    console.log('Water data for AI:', waterData);
  } catch (err) {
    console.error('❌ Error fetching water data:', err.message);
  }

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found!');
    return res.json({ 
      advice: ' API ключ не налаштовано. Використовую базові відповіді.'
    });
  }

  try {
    //  Актуальні моделі Gemini
    const models = [
      'gemini-2.5-flash',
      'gemini-3-flash-preview',
      'gemini-2.5-flash-lite'
    ];
    
    let lastError = null;
    
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const prompt = `Ти — AI-компаньйон для трекінгу води з ім'ям "Aqua Buddy" 
Відповідай українською мовою, дружньо та коротко (1-3 речення).

Дані користувача про воду:
- Сьогодні випито: ${waterData?.today || 0} мл
- Вчора випито: ${waterData?.yesterday || 0} мл
- Загальна кількість записів: ${waterData?.totalEntries || 0}
- Ціль на день: ${waterData?.goal || 2000} мл
- Місячна статистика: ${waterData?.monthlySummary || 'Немає даних'}
${waterData?.recentEntries?.length ? `- Останні записи: ${waterData.recentEntries.map(e => `${e.amount}мл (${e.date})`).join(', ')}` : ''}

Правила:
- Якщо користувач вітається - відповідай дружньо
- Якщо питання про воду - дай пораду
- Якщо користувач ділиться скільки випив - похвали
- Якщо користувач запитує скільки він випив води (сьогодні, вчора, за місяць) - відповідай на основі наданих даних
- Для запитів про минулі місяці використовуй місячну статистику
- Якщо даних недостатньо - скажи що не знаєш і запропонуй додати дані

Повідомлення користувача: "${message}"

Твоя відповідь:`;

        console.log(`Trying ${model}...`);
        
        const response = await axios.post(url, {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }, {
          timeout: 10000
        });
        
        const advice = response.data.candidates[0].content.parts[0].text;
        
        console.log(`✅ Success with ${model}!`);
        console.log('Response:', advice);
        
        return res.json({ advice });
        
      } catch (err) {
        console.log(`❌ ${model} failed:`, err.response?.status || err.message);
        lastError = err;
        continue;
      }
    }
    
    // Якщо всі моделі не спрацювали - система переходить fallback mock
    throw lastError;

  } catch (err) {
    console.error(' All Gemini models failed:', err.message);
    
    //  fallback
    const lowerMessage = message.toLowerCase();
    let mockAdvice = '';

    if (lowerMessage.includes('привіт') || lowerMessage.includes('hi')) {
      mockAdvice = 'Привіт! 👋 Як твоя гідратація сьогодні? Не забувай пити воду регулярно! 💧';
    } else if (lowerMessage.includes('скільки') && (lowerMessage.includes('сьогодні') || lowerMessage.includes('вчора'))) {
      if (lowerMessage.includes('сьогодні')) {
        mockAdvice = `Сьогодні ти випив ${waterData?.today || 0} мл води. ${waterData?.today >= (waterData?.goal || 2000) ? 'Чудово! Ти досяг цілі! 🎉' : 'Продовжуй пити воду! 💧'}`;
      } else if (lowerMessage.includes('вчора')) {
        mockAdvice = `Вчора ти випив ${waterData?.yesterday || 0} мл води. ${waterData?.yesterday >= (waterData?.goal || 2000) ? 'Це було чудово! 🎉' : 'Можна було б і більше! 💪'}`;
      }
    } else if (lowerMessage.includes('скільки') || lowerMessage.includes('норма')) {
      mockAdvice = 'Рекомендую 2-3 літри води на день. Почни з 8 склянок по 250мл! 💪💧';
    } else if (lowerMessage.match(/\d+\s*(мл|ml|літр)/i)) {
      mockAdvice = 'Чудово! 🎉 Продовжуй у тому ж дусі! Регулярне пиття води - запорука здоров\'я!';
    } else if (lowerMessage.includes('забуваю')) {
      mockAdvice = 'Постав нагадування на телефоні кожні 2 години ⏰ або тримай пляшку води під рукою!';
    } else {
      mockAdvice = 'Пий воду регулярно протягом дня - це важливо для здоров\'я! 💧😊';
    }
    
    console.log('Using fallback mock:', mockAdvice);
    res.json({ advice: mockAdvice });
  }
});

module.exports = router;