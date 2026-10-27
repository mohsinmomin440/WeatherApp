export const getWeatherIconName = (code) => {
  const c = Number(code);
  if (c === 0) return 'sun';
  if (c === 1 || c === 2) return 'cloud-sun';
  if (c === 3) return 'cloud';
  if (c === 45 || c === 48) return 'cloud-fog';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return 'cloud-rain';
  if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(c)) return 'snowflake';
  if ([95, 96, 99].includes(c)) return 'cloud-lightning';
  return 'cloud';
};
