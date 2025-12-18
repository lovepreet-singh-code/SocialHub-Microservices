import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'secret';

      const decoded = jwt.verify(token, jwtSecret) as IJwtPayload;

      // In microservices, we trust the token payload after verification
      // We assume the token includes the essential user info or just the ID
      req.user = {
        _id: decoded.id,
        name: (decoded as any).name || 'User',
        email: (decoded as any).email || ''
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
    return;
  }
};
