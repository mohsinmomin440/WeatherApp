const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getToken = () => localStorage.getItem('skycast_token');
export const setToken = (token) => {
  if (token) localStorage.setItem('skycast_token', token);
  else localStorage.removeItem('skycast_token');
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Request failed`);
  }
  return data;
};

export const api = {
  // Weather
  searchCities: (q) => request(`/weather/search?q=${encodeURIComponent(q)}`),
  getForecast: (lat, lon, timezone = 'auto') =>
    request(`/weather/forecast?lat=${lat}&lon=${lon}&timezone=${timezone}`),
  getAirQuality: (lat, lon) => request(`/weather/air-quality?lat=${lat}&lon=${lon}`),

  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  getMe: () => request('/auth/me'),

  // Favorites & Settings
  getFavorites: () => request('/users/favorites'),
  addFavorite: (city) =>
    request('/users/favorites', {
      method: 'POST',
      body: JSON.stringify(city),
    }),
  removeFavorite: (id) =>
    request(`/users/favorites/${id}`, {
      method: 'DELETE',
    }),
  updateSettings: (settings) =>
    request('/users/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),
};
