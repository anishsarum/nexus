import { Router, Request, Response } from 'express';
import Portfolio from '../models/Portfolio';
import auth from '../middleware/auth';

const router = Router();

// Get portfolio
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    res.json(portfolio);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Buy asset
router.post('/buy', auth, async (req: Request, res: Response) => {
  try {
    const { symbol, quantity, price } = req.body;
    // @ts-ignore
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      // @ts-ignore
      portfolio = new Portfolio({ user: req.user.id });
    }
    const cost = quantity * price;
    if (portfolio.cash < cost) return res.status(400).json({ error: 'Insufficient cash' });
    portfolio.cash -= cost;
    let holding = portfolio.holdings.find((h: any) => h.symbol === symbol);
    if (holding) {
      holding.avgPrice =
        (holding.avgPrice * holding.quantity + cost) / (holding.quantity + quantity);
      holding.quantity += quantity;
    } else {
      portfolio.holdings.push({ symbol, quantity, avgPrice: price });
    }
    portfolio.transactions.push({ type: 'buy', symbol, quantity, price });
    await portfolio.save();
    res.json(portfolio);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sell asset
router.post('/sell', auth, async (req: Request, res: Response) => {
  try {
    const { symbol, quantity, price } = req.body;
    // @ts-ignore
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    let holding = portfolio.holdings.find((h: any) => h.symbol === symbol);
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ error: 'Insufficient holdings' });
    holding.quantity -= quantity;
    portfolio.cash += quantity * price;
    portfolio.transactions.push({ type: 'sell', symbol, quantity, price });
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h: any) => h.symbol !== symbol);
    }
    await portfolio.save();
    res.json(portfolio);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
