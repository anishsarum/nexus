const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

// Get portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy asset
router.post('/buy', auth, async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id });
    }
    const cost = quantity * price;
    if (portfolio.cash < cost) return res.status(400).json({ error: 'Insufficient cash' });
    portfolio.cash -= cost;
    let holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (holding) {
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + cost) / (holding.quantity + quantity);
      holding.quantity += quantity;
    } else {
      portfolio.holdings.push({ symbol, quantity, avgPrice: price });
    }
    portfolio.transactions.push({ type: 'buy', symbol, quantity, price });
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sell asset
router.post('/sell', auth, async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    let holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) return res.status(400).json({ error: 'Insufficient holdings' });
    holding.quantity -= quantity;
    portfolio.cash += quantity * price;
    portfolio.transactions.push({ type: 'sell', symbol, quantity, price });
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
    }
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
