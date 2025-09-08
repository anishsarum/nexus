import { Router, Request, Response } from 'express';
import Watchlist from '../models/Watchlist';
import auth from '../middleware/auth';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { symbol, name } = req.body;
    // @ts-ignore
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      // @ts-ignore
      watchlist = new Watchlist({ user: req.user.id, assets: [] });
    }
    const exists = watchlist.assets.some((a: any) => a.symbol === symbol);
    if (exists) {
      watchlist.assets = watchlist.assets.filter((a: any) => a.symbol !== symbol);
    } else {
      watchlist.assets.push({ symbol, name });
    }
    await watchlist.save();
    res.json(watchlist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    res.json(watchlist ? watchlist.assets : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:symbol', auth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    // @ts-ignore
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    watchlist.assets = watchlist.assets.filter((a: any) => a.symbol !== symbol);
    await watchlist.save();
    res.json(watchlist.assets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
