import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token, authorization denied.' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).user = { id: decoded.userId };
    next();
  } catch {
    res.status(401).json({ error: 'Token is not valid.' });
  }
}
