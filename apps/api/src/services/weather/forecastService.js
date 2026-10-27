import { env } from '../../config/env.js';
import { getWeatherInfoByCode } from '../../utils/wmo.js';

export const getForecast = async (latitude, longitude, timezone = 'auto') => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90.');
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180.');
  }

  const url = new URL(env.OPEN_METEO_FORECAST_URL);
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lon.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index'
  );
  url.searchParams.set(
    'hourly',
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,surface_pressure'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max'
  );
  url.searchParams.set('timezone', timezone);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstream weather service returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const resolvedTimezone = data.timezone || 'UTC';
    const currentTimeStr = data.current?.time;

    // Map current condition
    const currentCode = data.current?.weather_code ?? 0;
    const currentInfo = getWeatherInfoByCode(currentCode);

    const current = {
      time: currentTimeStr,
      temperature: data.current?.temperature_2m ?? null,
      feelsLike: data.current?.apparent_temperature ?? null,
      humidity: data.current?.relative_humidity_2m ?? null,
      pressure: data.current?.surface_pressure ? Math.round(data.current.surface_pressure) : null,
      windSpeed: data.current?.wind_speed_10m ?? null,
      windDirection: data.current?.wind_direction_10m ?? null,
      precipitation: data.current?.precipitation ?? 0,
      uvIndex: data.current?.uv_index ?? (data.daily?.uv_index_max?.[0] ?? 0),
      weatherCode: currentCode,
      condition: currentInfo.label,
      icon: currentInfo.icon,
      category: currentInfo.category,
    };

    // Find starting index for next 24 hourly points
    let startIndex = 0;
    if (currentTimeStr && data.hourly?.time) {
      const idx = data.hourly.time.findIndex((t) => t >= currentTimeStr);
      if (idx !== -1) startIndex = idx;
    }

    // Process next 24 hours
    const hourlyTimes = data.hourly?.time?.slice(startIndex, startIndex + 24) || [];
    const hourly = hourlyTimes.map((time, i) => {
      const actualIndex = startIndex + i;
      const code = data.hourly?.weather_code?.[actualIndex] ?? 0;
      const info = getWeatherInfoByCode(code);
      const temp = data.hourly?.temperature_2m?.[actualIndex] ?? null;
      const precipProb = data.hourly?.precipitation_probability?.[actualIndex] ?? 0;
      const humidity = data.hourly?.relative_humidity_2m?.[actualIndex] ?? null;
      const windSpeed = data.hourly?.wind_speed_10m?.[actualIndex] ?? null;

      // Extract time label (e.g. 12 PM, 3 PM)
      const dateObj = new Date(time);
      const hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
      const label = i === 0 ? 'Now' : `${formattedHour} ${ampm}`;

      return {
        time,
        label,
        temperature: temp !== null ? Math.round(temp) : null,
        humidity,
        windSpeed,
        precipitationProbability: precipProb,
        weatherCode: code,
        condition: info.label,
        icon: info.icon,
      };
    });

    // Process 7-day daily forecast
    const dailyTimes = data.daily?.time?.slice(0, 7) || [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const daily = dailyTimes.map((dateStr, i) => {
      const code = data.daily?.weather_code?.[i] ?? 0;
      const info = getWeatherInfoByCode(code);
      const maxTemp = data.daily?.temperature_2m_max?.[i] ?? null;
      const minTemp = data.daily?.temperature_2m_min?.[i] ?? null;
      const sunrise = data.daily?.sunrise?.[i] || null;
      const sunset = data.daily?.sunset?.[i] || null;
      const uvMax = data.daily?.uv_index_max?.[i] ?? null;
      const precipProbMax = data.daily?.precipitation_probability_max?.[i] ?? 0;

      const dateObj = new Date(dateStr + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : weekdays[dateObj.getDay()];
      const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;

      // Format sunrise and sunset times (e.g. 6:12 AM)
      const formatTime = (isoStr) => {
        if (!isoStr) return '--:--';
        const d = new Date(isoStr);
        let h = d.getHours();
        const m = d.getMinutes().toString().padStart(2, '0');
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12 === 0 ? 12 : h % 12;
        return `${h}:${m} ${period}`;
      };

      return {
        date: dateStr,
        dayName,
        formattedDate,
        maxTemp: maxTemp !== null ? Math.round(maxTemp) : null,
        minTemp: minTemp !== null ? Math.round(minTemp) : null,
        weatherCode: code,
        condition: info.label,
        icon: info.icon,
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
        uvMax,
        precipitationProbabilityMax: precipProbMax,
      };
    });

    // Generate rule-based practical weather insights
    const insights = [];
    if (current.uvIndex >= 6) {
      insights.push({
        type: 'warning',
        title: 'High UV Alert',
        message: 'UV index is elevated. Consider wearing sunscreen and UV-protective sunglasses.',
      });
    } else if (current.uvIndex >= 3) {
      insights.push({
        type: 'info',
        title: 'Moderate UV',
        message: 'Moderate sun exposure. Seek shade during peak midday hours.',
      });
    }

    if (current.precipitation > 0 || current.category === 'rain') {
      insights.push({
        type: 'info',
        title: 'Rain Gear Recommended',
        message: 'Active precipitation detected. Keep an umbrella handy.',
      });
    } else if (current.windSpeed > 35) {
      insights.push({
        type: 'warning',
        title: 'Breezy Conditions',
        message: `Strong winds around ${Math.round(current.windSpeed)} km/h. Secure loose outdoor objects.`,
      });
    } else if (current.temperature >= 18 && current.temperature <= 26 && current.category === 'clear') {
      insights.push({
        type: 'success',
        title: 'Pleasant Outdoors',
        message: 'Ideal conditions for outdoor sports, walking, or travel.',
      });
    }

    return {
      coordinates: { latitude: lat, longitude: lon },
      timezone: resolvedTimezone,
      elevation: data.elevation ?? 0,
      current,
      todayHighlights: {
        sunrise: daily[0]?.sunrise || '06:00 AM',
        sunset: daily[0]?.sunset || '06:00 PM',
        uvIndex: current.uvIndex,
        uvCategory: current.uvIndex >= 8 ? 'Very High' : current.uvIndex >= 6 ? 'High' : current.uvIndex >= 3 ? 'Moderate' : 'Low',
        visibilityKm: 10, // Standard nominal visibility estimate
        humidity: current.humidity,
        pressure: current.pressure,
        windSpeed: current.windSpeed,
        windDirection: current.windDirection,
      },
      hourly,
      daily,
      insights,
      attribution: {
        source: 'Open-Meteo',
        url: 'https://open-meteo.com/',
        license: 'Free weather API for non-commercial and commercial use with attribution',
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Weather forecast request timed out after 8 seconds.');
    }
    throw error;
  }
};
