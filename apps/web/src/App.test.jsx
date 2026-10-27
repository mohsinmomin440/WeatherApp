import { describe, it, expect } from 'vitest';
import { formatTemp, formatSpeed } from './utils/units.js';
import { getWeatherIconName } from './utils/wmo.js';

describe('Web Utility Functions', () => {
  it('formats temperatures correctly for Celsius and Fahrenheit', () => {
    expect(formatTemp(22, 'celsius')).toBe('22°');
    expect(formatTemp(22, 'fahrenheit')).toBe('72°');
    expect(formatTemp(0, 'celsius')).toBe('0°');
    expect(formatTemp(0, 'fahrenheit')).toBe('32°');
  });

  it('formats wind speed correctly', () => {
    expect(formatSpeed(12, 'celsius')).toBe('12 km/h');
    expect(formatSpeed(12, 'fahrenheit')).toBe('7 mph');
  });

  it('resolves WMO codes to appropriate icon identifiers', () => {
    expect(getWeatherIconName(0)).toBe('sun');
    expect(getWeatherIconName(2)).toBe('cloud-sun');
    expect(getWeatherIconName(3)).toBe('cloud');
    expect(getWeatherIconName(61)).toBe('cloud-rain');
    expect(getWeatherIconName(71)).toBe('snowflake');
    expect(getWeatherIconName(95)).toBe('cloud-lightning');
  });
});
