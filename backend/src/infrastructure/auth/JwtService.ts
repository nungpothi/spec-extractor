import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export class JwtService {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
    });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static extractTokenFromHeader(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid authorization header');
    }
    return authHeader.substring(7);
  }
}