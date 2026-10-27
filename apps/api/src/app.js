import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRouter from './routes/api.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration supporting web & mobile clients
const allowedOrigins = env.CLIENT_URL.split(',').map((url) => url.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps, curl, postman (where origin is undefined) or allowed origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        // Also allow local development origins like localhost:5173, localhost:8081, 127.0.0.1
        if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev to support mobile LAN testing
        }
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'SkyCast Smart Weather Platform API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'online',
  });
});

// Mount API v1
app.use('/api/v1', apiRouter);
// Also alias to /api for developer convenience
app.use('/api', apiRouter);

// 404 & Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
