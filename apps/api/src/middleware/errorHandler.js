import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  // Safe logging excluding passwords and authorization
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);

  const response = {
    success: false,
    error: err.message || 'An unexpected internal server error occurred.',
  };

  if (env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
