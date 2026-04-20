const WaterEntry = require('../models/WaterEntry');

exports.add = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const entry = await WaterEntry.create({ user: req.user._id, amount });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const entries = await WaterEntry.find({ user: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const entry = await WaterEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { amount },
      { new: true }
    );

    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
