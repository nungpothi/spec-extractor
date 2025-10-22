import { Request, Response, NextFunction } from 'express';
import { JwtService, JwtPayload } from '../../infrastructure/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
          status: false,
          message: 'No authorization header provided',
          results: [],
          errors: ['Authentication required'],
        });
        return;
      }

      const token = JwtService.extractTokenFromHeader(authHeader);
      const payload = JwtService.verifyToken(token);
      
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({
        status: false,
        message: 'Invalid token',
        results: [],
        errors: [error instanceof Error ? error.message : 'Authentication failed'],
      });
    }
  }

  static requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: 'Authentication required',
        results: [],
        errors: ['No user in request'],
      });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: false,
        message: 'Admin access required',
        results: [],
        errors: ['Insufficient permissions'],
      });
      return;
    }

    next();
  }
}