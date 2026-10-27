import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User, memoryUserStore } from '../models/User.js';
import { getDbStatus } from '../config/db.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error',
      });
    }

    const { name, email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    const isConnected = getDbStatus().connected;

    if (isConnected) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
        favorites: [
          {
            name: 'New York',
            country: 'USA',
            admin1: 'New York',
            latitude: 40.7128,
            longitude: -74.006,
            timezone: 'America/New_York',
          },
          {
            name: 'London',
            country: 'UK',
            admin1: 'Greater London',
            latitude: 51.5074,
            longitude: -0.1278,
            timezone: 'Europe/London',
          },
          {
            name: 'Tokyo',
            country: 'Japan',
            admin1: 'Tokyo',
            latitude: 35.6762,
            longitude: 139.6503,
            timezone: 'Asia/Tokyo',
          },
          {
            name: 'Mumbai',
            country: 'India',
            admin1: 'Maharashtra',
            latitude: 19.076,
            longitude: 72.8777,
            timezone: 'Asia/Kolkata',
          },
        ],
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          favorites: user.favorites,
          settings: user.settings,
        },
      });
    } else {
      // Memory store fallback
      const existing = await memoryUserStore.findByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = await memoryUserStore.create({
        name,
        email: normalizedEmail,
        passwordHash,
      });

      const token = generateToken(user.id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (local session)',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          favorites: user.favorites,
          settings: user.settings,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error',
      });
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();
    const isConnected = getDbStatus().connected;

    let user;
    let passwordMatch = false;

    if (isConnected) {
      user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
      if (user) {
        passwordMatch = await bcrypt.compare(password, user.passwordHash);
      }
    } else {
      user = await memoryUserStore.findByEmail(normalizedEmail);
      if (user) {
        passwordMatch = await bcrypt.compare(password, user.passwordHash);
      }
    }

    // Generic failure message to prevent email enumeration
    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(user._id || user.id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      favorites: req.user.favorites,
      settings: req.user.settings,
    },
  });
};

export const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};
