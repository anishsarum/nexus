import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import watchlistRoutes from './routes/watchlist';
import portfolioRoutes from './routes/portfolio';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/trading';

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.send('Trading Platform Backend');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
