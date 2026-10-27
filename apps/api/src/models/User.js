import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const favoriteCitySchema = new mongoose.Schema(
  {
    id: { type: String, required: false },
    name: { type: String, required: true, trim: true },
    country: { type: String, default: '' },
    admin1: { type: String, default: '' },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    timezone: { type: String, default: 'auto' },
    imageUrl: { type: String, default: '' },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return in queries by default
    },
    favorites: {
      type: [favoriteCitySchema],
      default: [],
      validate: [
        (val) => val.length <= 20,
        '{PATH} exceeds the limit of 20 favorite cities',
      ],
    },
    settings: {
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius',
      },
      theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Persistent Local Store (Used automatically if MongoDB is not running)
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');
const inMemoryUsers = new Map();

const loadDiskStore = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => inMemoryUsers.set(u.id || u._id, u));
      }
    }
  } catch (err) {
    console.warn('[Store] Could not load disk fallback:', err.message);
  }
};

const persistDiskStore = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const arr = Array.from(inMemoryUsers.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Store] Could not persist disk fallback:', err.message);
  }
};

loadDiskStore();

export const memoryUserStore = {
  users: inMemoryUsers,

  async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    for (const u of inMemoryUsers.values()) {
      if (u.email === normalized) return { ...u };
    }
    return null;
  },

  async findById(id) {
    const u = inMemoryUsers.get(id);
    return u ? { ...u } : null;
  },

  async create({ name, email, passwordHash }) {
    const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newUser = {
      _id: id,
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      favorites: [
        {
          id: 'ny',
          name: 'New York',
          country: 'USA',
          admin1: 'New York',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
        {
          id: 'lon',
          name: 'London',
          country: 'UK',
          admin1: 'Greater London',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'Europe/London',
        },
        {
          id: 'tok',
          name: 'Tokyo',
          country: 'Japan',
          admin1: 'Tokyo',
          latitude: 35.6762,
          longitude: 139.6503,
          timezone: 'Asia/Tokyo',
        },
        {
          id: 'mum',
          name: 'Mumbai',
          country: 'India',
          admin1: 'Maharashtra',
          latitude: 19.076,
          longitude: 72.8777,
          timezone: 'Asia/Kolkata',
        },
      ],
      settings: { unit: 'celsius', theme: 'dark' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryUsers.set(id, newUser);
    persistDiskStore();
    return newUser;
  },

  async update(id, updates) {
    const existing = inMemoryUsers.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    inMemoryUsers.set(id, updated);
    persistDiskStore();
    return updated;
  },
};
