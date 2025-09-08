import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/signup', async (req: Request, res: Response) => {
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = '[REDACTED]';
  console.log('Signup request body:', safeBody);
  const { email, password } = req.body;
  if (!email || !password) {
    console.warn('Signup error: Missing email or password');
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('Signup error: Email already exists:', email);
      return res.status(400).json({ error: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log('Signup success for:', email);
    res.status(201).json({ message: 'User created successfully.', token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = '[REDACTED]';
  console.log('Login request body:', safeBody);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
