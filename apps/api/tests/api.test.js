import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { WMO_CODE_MAP, getWeatherInfoByCode } from '../src/utils/wmo.js';
import { celsiusToFahrenheit, fahrenheitToCelsius, kmhToMph } from '../src/utils/units.js';

describe('Unit Utilities', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(22)).toBe(72);
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('converts Fahrenheit to Celsius correctly', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(72)).toBe(22);
  });

  it('converts km/h to mph correctly', () => {
    expect(kmhToMph(100)).toBe(62);
    expect(kmhToMph(12)).toBe(7);
  });

  it('maps WMO codes properly', () => {
    const clear = getWeatherInfoByCode(0);
    expect(clear.label).toBe('Clear Sky');
    expect(clear.category).toBe('clear');

    const partlyCloudy = getWeatherInfoByCode(2);
    expect(partlyCloudy.label).toBe('Partly Cloudy');

    const rain = getWeatherInfoByCode(61);
    expect(rain.label).toBe('Slight Rain');
    expect(rain.category).toBe('rain');
  });
});

describe('API Endpoints', () => {
  let authToken = '';

  it('GET /api/v1/health returns 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
    expect(res.body.platform).toContain('SkyCast');
  });

  it('GET /api/v1/weather/search rejects empty query', async () => {
    const res = await request(app).get('/api/v1/weather/search?q=');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/weather/search returns results for "London"', async () => {
    const res = await request(app).get('/api/v1/weather/search?q=London');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('latitude');
    expect(res.body.data[0]).toHaveProperty('longitude');
  });

  it('GET /api/v1/weather/forecast rejects invalid coordinates', async () => {
    const res = await request(app).get('/api/v1/weather/forecast?lat=999&lon=999');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/weather/forecast returns full weather dataset for New York', async () => {
    const res = await request(app).get('/api/v1/weather/forecast?lat=40.7128&lon=-74.006');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('current');
    expect(res.body.data.current).toHaveProperty('temperature');
    expect(res.body.data.current).toHaveProperty('humidity');
    expect(res.body.data.current).toHaveProperty('windSpeed');
    expect(res.body.data).toHaveProperty('todayHighlights');
    expect(res.body.data).toHaveProperty('hourly');
    expect(res.body.data.hourly.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('daily');
    expect(res.body.data.daily.length).toBe(7);
  });

  it('POST /api/v1/auth/register creates a user successfully', async () => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.name).toBe('John Doe');
    expect(res.body.user).not.toHaveProperty('passwordHash');

    authToken = res.body.token;
  });

  it('GET /api/v1/users/me returns authenticated user details', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('John Doe');
  });

  it('GET /api/v1/users/me rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/users/favorites adds a new favorite city', async () => {
    const res = await request(app)
      .post('/api/v1/users/favorites')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Paris',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const paris = res.body.data.find((c) => c.name === 'Paris');
    expect(paris).toBeDefined();
  });

  it('PATCH /api/v1/users/settings updates temperature unit', async () => {
    const res = await request(app)
      .patch('/api/v1/users/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        unit: 'fahrenheit',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.unit).toBe('fahrenheit');
  });
});
