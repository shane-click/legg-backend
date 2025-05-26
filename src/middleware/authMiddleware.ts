import { verify } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthedReq extends Request {
  user?: any;
}

export const protect = (req: AuthedReq, res: Response, next: NextFunction) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = verify(hdr.slice(7), process.env.SUPABASE_JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
