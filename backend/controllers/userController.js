const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
    if (password.length < 4) return res.status(400).json({ message: 'Пароль має бути не менше 4 символів' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'User exists' });
    const user = await User.create({ username, password });
    res.json({ _id: user._id, username: user.username, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await user.matchPassword(password)) {
      res.json({ _id: user._id, username: user.username, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
