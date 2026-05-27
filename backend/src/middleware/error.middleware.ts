import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`❤️ [Error Handled] ${req.method} ${req.url} - Status: ${status} - Message: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
