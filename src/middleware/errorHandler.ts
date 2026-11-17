import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message
  });
};
