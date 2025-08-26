const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/auth');

// Add asset to watchlist
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, name } = req.body;
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user.id, assets: [] });
    }
    watchlist.assets.push({ symbol, name });
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all assets in watchlist
router.get('/', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    res.json(watchlist ? watchlist.assets : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove asset from watchlist
router.delete('/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    watchlist.assets = watchlist.assets.filter(a => a.symbol !== symbol);
    await watchlist.save();
    res.json(watchlist.assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
