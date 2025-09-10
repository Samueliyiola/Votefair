// src/interfaces/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../shared';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  //Just added this to fix the auth error on '/graphql' endpoint
  if (!authHeader) {
    return next();
  }
  //console.log('Auth Header:', authHeader); To check for an issue
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // throw new Error('Authentication token is missing');
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin,

    };
    next();
  } catch (error) {
    throw new Error('Invalid authentication token');
    // console.warn('Invalid token:', error);

  }
};