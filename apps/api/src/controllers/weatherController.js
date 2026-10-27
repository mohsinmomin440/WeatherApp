import { searchCities } from '../services/geocoding/geocodingService.js';
import { getForecast } from '../services/weather/forecastService.js';
import { getAirQuality } from '../services/weather/airQualityService.js';

// Simple in-memory response cache for forecast (5 minutes TTL)
const forecastCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

export const handleSearch = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required.',
      });
    }

    const results = await searchCities(query);
    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const handleForecast = async (req, res, next) => {
  try {
    const { lat, lon, timezone } = req.query;

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Both "lat" and "lon" query parameters are required.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        error: 'Latitude must be a valid number between -90 and 90.',
      });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Longitude must be a valid number between -180 and 180.',
      });
    }

    // Cache key rounded to 2 decimal places (~1.1 km precision)
    const cacheKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}_${timezone || 'auto'}`;
    const cached = forecastCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({
        success: true,
        cached: true,
        data: cached.data,
      });
    }

    const forecast = await getForecast(latitude, longitude, timezone || 'auto');

    // Store in cache
    forecastCache.set(cacheKey, {
      timestamp: Date.now(),
      data: forecast,
    });

    return res.json({
      success: true,
      cached: false,
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
};

export const handleAirQuality = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Both "lat" and "lon" query parameters are required.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided for air quality.',
      });
    }

    const aqiData = await getAirQuality(latitude, longitude);
    return res.json({
      success: true,
      data: aqiData,
    });
  } catch (error) {
    next(error);
  }
};
