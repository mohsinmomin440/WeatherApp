import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User, memoryUserStore } from '../models/User.js';
import { getDbStatus } from '../config/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Malformed authorization token.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid or forged authentication token.',
      });
    }

    let user;
    if (getDbStatus().connected) {
      user = await User.findById(decoded.id).select('-passwordHash');
    } else {
      user = await memoryUserStore.findById(decoded.id);
      if (user) {
        delete user.passwordHash;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found or has been removed.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to authenticate request.',
    });
  }
};
