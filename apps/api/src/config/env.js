import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/skycast'),
  JWT_SECRET: z.string().default('skycast_fallback_jwt_secret_do_not_use_in_prod'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173,http://localhost:3000'),
  OPEN_METEO_FORECAST_URL: z.string().default('https://api.open-meteo.com/v1/forecast'),
  OPEN_METEO_GEOCODING_URL: z.string().default('https://geocoding-api.open-meteo.com/v1/search'),
  OPEN_METEO_AIR_QUALITY_URL: z.string().default('https://air-quality-api.open-meteo.com/v1/air-quality'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
