import mongoose from 'mongoose';
import { env } from './env.js';

let isDbConnected = false;

export const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    return; // Tests can use memory-server or separate test mock
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${env.MONGODB_URI}.`);
    console.warn(`[MongoDB Warning] Details: ${error.message}`);
    console.warn(`[MongoDB Notice] Authentication & Favorites will operate in local in-memory fallback mode until MongoDB is running.`);
  }
};

export const getDbStatus = () => ({
  connected: isDbConnected,
  uri: env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Mask credentials
});
