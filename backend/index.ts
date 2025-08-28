import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/trading';

app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Import routes and middleware as needed

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
