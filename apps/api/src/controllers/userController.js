import { z } from 'zod';
import { User, memoryUserStore } from '../models/User.js';
import { getDbStatus } from '../config/db.js';

const favoriteSchema = z.object({
  name: z.string().min(1, 'City name is required'),
  country: z.string().optional().default(''),
  admin1: z.string().optional().default(''),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional().default('auto'),
  imageUrl: z.string().optional().default(''),
});

const settingsSchema = z.object({
  unit: z.enum(['celsius', 'fahrenheit']).optional(),
  theme: z.enum(['dark', 'light']).optional(),
});

export const getFavorites = async (req, res) => {
  return res.json({
    success: true,
    data: req.user.favorites || [],
  });
};

export const addFavorite = async (req, res, next) => {
  try {
    const parseResult = favoriteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid favorite city data',
      });
    }

    const city = parseResult.data;
    const userId = req.user._id || req.user.id;
    const isConnected = getDbStatus().connected;

    let currentFavorites = req.user.favorites || [];

    if (currentFavorites.length >= 20) {
      return res.status(400).json({
        success: false,
        error: 'You have reached the maximum limit of 20 favorite cities.',
      });
    }

    // Check for duplicate (by latitude/longitude within 0.05 degrees or exact name & country)
    const duplicate = currentFavorites.some(
      (f) =>
        (Math.abs(f.latitude - city.latitude) < 0.05 &&
          Math.abs(f.longitude - city.longitude) < 0.05) ||
        (f.name.toLowerCase() === city.name.toLowerCase() &&
          f.country?.toLowerCase() === city.country?.toLowerCase())
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: `${city.name} is already in your favorite cities.`,
      });
    }

    const newFavItem = {
      id: 'fav_' + Date.now(),
      ...city,
    };

    let updatedFavorites;
    if (isConnected) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { favorites: newFavItem } },
        { new: true, runValidators: true }
      );
      updatedFavorites = updatedUser.favorites;
    } else {
      currentFavorites.push(newFavItem);
      const updatedUser = await memoryUserStore.update(userId, {
        favorites: currentFavorites,
      });
      updatedFavorites = updatedUser.favorites;
    }

    return res.status(201).json({
      success: true,
      message: `${city.name} added to favorites.`,
      data: updatedFavorites,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const isConnected = getDbStatus().connected;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Favorite ID is required.',
      });
    }

    let updatedFavorites;
    if (isConnected) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: { _id: id } } },
        { new: true }
      );
      // Also try matching custom id if Mongoose _id didn't match
      if (updatedUser.favorites.length === req.user.favorites.length) {
        const fallbackUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { favorites: { id } } },
          { new: true }
        );
        updatedFavorites = fallbackUser?.favorites || [];
      } else {
        updatedFavorites = updatedUser.favorites;
      }
    } else {
      const filtered = (req.user.favorites || []).filter(
        (f) => f.id !== id && f._id !== id
      );
      const updatedUser = await memoryUserStore.update(userId, {
        favorites: filtered,
      });
      updatedFavorites = updatedUser.favorites;
    }

    return res.json({
      success: true,
      message: 'City removed from favorites.',
      data: updatedFavorites,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const parseResult = settingsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid settings',
      });
    }

    const updates = parseResult.data;
    const userId = req.user._id || req.user.id;
    const isConnected = getDbStatus().connected;

    let updatedSettings;
    if (isConnected) {
      const user = await User.findById(userId);
      if (updates.unit) user.settings.unit = updates.unit;
      if (updates.theme) user.settings.theme = updates.theme;
      await user.save();
      updatedSettings = user.settings;
    } else {
      const existingSettings = req.user.settings || { unit: 'celsius', theme: 'dark' };
      const newSettings = { ...existingSettings, ...updates };
      const updatedUser = await memoryUserStore.update(userId, {
        settings: newSettings,
      });
      updatedSettings = updatedUser.settings;
    }

    return res.json({
      success: true,
      message: 'Settings updated successfully.',
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};
