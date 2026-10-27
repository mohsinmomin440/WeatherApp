export const formatTemp = (celsius, unit = 'celsius') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  const val = Math.round(celsius);
  if (unit === 'fahrenheit') {
    const f = Math.round((val * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${val}°`;
};

export const formatSpeed = (kmh, unit = 'celsius') => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  const val = Math.round(kmh);
  if (unit === 'fahrenheit') {
    const mph = Math.round(val * 0.621371);
    return `${mph} mph`;
  }
  return `${val} km/h`;
};
