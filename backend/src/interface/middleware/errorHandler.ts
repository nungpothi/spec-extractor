import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const status = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(status).json({
    status: false,
    message: error.message || 'Internal server error',
    results: [],
    errors: [error.message || 'Internal server error'],
  });
};