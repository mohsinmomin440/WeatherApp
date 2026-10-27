import { env } from '../../config/env.js';

export const searchCities = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query parameter "q" is required and cannot be empty.');
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = new URL(env.OPEN_METEO_GEOCODING_URL);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstream geocoding service returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '', // State or province
      timezone: item.timezone || 'UTC',
      elevation: item.elevation ?? null,
      population: item.population ?? null,
    }));
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Geocoding request timed out after 8 seconds.');
    }
    throw error;
  }
};
