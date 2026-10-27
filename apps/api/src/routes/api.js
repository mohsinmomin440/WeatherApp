import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDbStatus } from '../config/db.js';
import {
  handleSearch,
  handleForecast,
  handleAirQuality,
} from '../controllers/weatherController.js';
import {
  register,
  login,
  getMe,
  logout,
} from '../controllers/authController.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateSettings,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Rate limiting for auth routes (15 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for weather queries (100 req per minute)
const weatherLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    error: 'Weather API rate limit exceeded. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ==========================================
   Public Health Check
   ========================================== */
router.get('/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    success: true,
    status: 'healthy',
    platform: 'SkyCast Smart Weather Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus.connected ? 'connected' : 'memory-fallback',
      engine: 'MongoDB / Mongoose',
    },
    services: {
      openMeteo: 'active',
      geocoding: 'active',
    },
  });
});

/* ==========================================
   Weather Routes (Open-Meteo Integration)
   ========================================== */
router.get('/weather/search', weatherLimiter, handleSearch);
router.get('/weather/forecast', weatherLimiter, handleForecast);
router.get('/weather/air-quality', weatherLimiter, handleAirQuality);

/* ==========================================
   Authentication Routes
   ========================================== */
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, getMe);

/* ==========================================
   User Profile, Favorites & Settings
   ========================================== */
router.get('/users/me', requireAuth, getMe);
router.get('/users/favorites', requireAuth, getFavorites);
router.post('/users/favorites', requireAuth, addFavorite);
router.delete('/users/favorites/:id', requireAuth, removeFavorite);
router.patch('/users/settings', requireAuth, updateSettings);
router.put('/users/settings', requireAuth, updateSettings);

export default router;
