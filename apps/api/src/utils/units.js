/**
 * SkyCast Unit Conversion Utilities
 */

export const celsiusToFahrenheit = (celsius) => {
  if (typeof celsius !== 'number' || isNaN(celsius)) return null;
  return Math.round((celsius * 9) / 5 + 32);
};

export const fahrenheitToCelsius = (fahrenheit) => {
  if (typeof fahrenheit !== 'number' || isNaN(fahrenheit)) return null;
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

export const kmhToMph = (kmh) => {
  if (typeof kmh !== 'number' || isNaN(kmh)) return null;
  return Math.round(kmh * 0.621371);
};

export const formatTemperature = (temp, unit = 'celsius') => {
  if (temp === null || temp === undefined || isNaN(temp)) return '--';
  const rounded = Math.round(temp);
  return unit === 'fahrenheit'
    ? `${celsiusToFahrenheit(rounded)}°F`
    : `${rounded}°C`;
};
