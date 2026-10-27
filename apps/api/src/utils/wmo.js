/**
 * Centralized WMO (World Meteorological Organization) weather interpretation code mapping.
 * Maps code to human-readable description, icon identifier, and category.
 */
export const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'sun', category: 'clear', isDay: true },
  1: { label: 'Mainly Clear', icon: 'sun-cloud', category: 'clear', isDay: true },
  2: { label: 'Partly Cloudy', icon: 'cloud-sun', category: 'cloudy', isDay: true },
  3: { label: 'Overcast', icon: 'cloud', category: 'cloudy' },
  45: { label: 'Fog', icon: 'cloud-fog', category: 'fog' },
  48: { label: 'Depositing Rime Fog', icon: 'cloud-fog', category: 'fog' },
  51: { label: 'Light Drizzle', icon: 'cloud-drizzle', category: 'rain' },
  53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle', category: 'rain' },
  55: { label: 'Dense Drizzle', icon: 'cloud-drizzle', category: 'rain' },
  56: { label: 'Light Freezing Drizzle', icon: 'cloud-snow', category: 'snow' },
  57: { label: 'Dense Freezing Drizzle', icon: 'cloud-snow', category: 'snow' },
  61: { label: 'Slight Rain', icon: 'cloud-rain', category: 'rain' },
  63: { label: 'Moderate Rain', icon: 'cloud-rain', category: 'rain' },
  65: { label: 'Heavy Rain', icon: 'cloud-rain', category: 'rain' },
  66: { label: 'Light Freezing Rain', icon: 'cloud-snow', category: 'snow' },
  67: { label: 'Heavy Freezing Rain', icon: 'cloud-snow', category: 'snow' },
  71: { label: 'Slight Snow', icon: 'snowflake', category: 'snow' },
  73: { label: 'Moderate Snow', icon: 'snowflake', category: 'snow' },
  75: { label: 'Heavy Snow', icon: 'snowflake', category: 'snow' },
  77: { label: 'Snow Grains', icon: 'snowflake', category: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'cloud-rain', category: 'rain' },
  81: { label: 'Moderate Rain Showers', icon: 'cloud-rain', category: 'rain' },
  82: { label: 'Violent Rain Showers', icon: 'cloud-rain', category: 'rain' },
  85: { label: 'Slight Snow Showers', icon: 'snowflake', category: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: 'snowflake', category: 'snow' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning', category: 'thunderstorm' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'cloud-lightning', category: 'thunderstorm' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'cloud-lightning', category: 'thunderstorm' },
};

/**
 * Get weather info from WMO code.
 * Fallbacks cleanly to unknown if code is unlisted.
 */
export const getWeatherInfoByCode = (code) => {
  const numericCode = Number(code);
  if (WMO_CODE_MAP[numericCode]) {
    return {
      code: numericCode,
      ...WMO_CODE_MAP[numericCode],
    };
  }
  return {
    code: numericCode,
    label: 'Unknown',
    icon: 'cloud',
    category: 'unknown',
  };
};
