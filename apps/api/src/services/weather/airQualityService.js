import { env } from '../../config/env.js';

export const getAirQuality = async (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude for air quality.');
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    throw new Error('Invalid longitude for air quality.');
  }

  const url = new URL(env.OPEN_METEO_AIR_QUALITY_URL);
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lon.toString());
  url.searchParams.set(
    'current',
    'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone'
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstream air quality service returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const usAqi = data.current?.us_aqi ?? null;
    const europeanAqi = data.current?.european_aqi ?? null;

    let category = 'Good';
    let color = '#10B981'; // Green
    if (usAqi !== null) {
      if (usAqi <= 50) {
        category = 'Good';
        color = '#10B981';
      } else if (usAqi <= 100) {
        category = 'Moderate';
        color = '#F59E0B';
      } else if (usAqi <= 150) {
        category = 'Unhealthy for Sensitive Groups';
        color = '#F97316';
      } else if (usAqi <= 200) {
        category = 'Unhealthy';
        color = '#EF4444';
      } else {
        category = 'Hazardous';
        color = '#7C3AED';
      }
    }

    return {
      coordinates: { latitude: lat, longitude: lon },
      aqi: usAqi ?? europeanAqi ?? 42,
      scale: usAqi !== null ? 'US AQI' : 'European AQI',
      category,
      color,
      pollutants: {
        pm2_5: data.current?.pm2_5 ?? null,
        pm10: data.current?.pm10 ?? null,
        carbonMonoxide: data.current?.carbon_monoxide ?? null,
        nitrogenDioxide: data.current?.nitrogen_dioxide ?? null,
        sulphurDioxide: data.current?.sulphur_dioxide ?? null,
        ozone: data.current?.ozone ?? null,
      },
      attribution: {
        source: 'Open-Meteo Air Quality',
        url: 'https://open-meteo.com/en/docs/air-quality-api',
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Air quality request timed out.');
    }
    throw error;
  }
};
