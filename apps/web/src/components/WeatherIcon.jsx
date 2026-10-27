import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
} from 'lucide-react';
import { getWeatherIconName } from '../utils/wmo.js';

export const WeatherIcon = ({ code, iconName, className = 'w-6 h-6', ...props }) => {
  const name = iconName || (code !== undefined ? getWeatherIconName(code) : 'cloud');

  switch (name) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} {...props} />;
    case 'cloud-sun':
    case 'sun-cloud':
      return <CloudSun className={`${className} text-amber-300`} {...props} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-300`} {...props} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-cyan-400`} {...props} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-cyan-400`} {...props} />;
    case 'cloud-snow':
    case 'snowflake':
      return <CloudSnow className={`${className} text-sky-200`} {...props} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-yellow-400`} {...props} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} {...props} />;
    default:
      return <Cloud className={`${className} text-slate-300`} {...props} />;
  }
};
