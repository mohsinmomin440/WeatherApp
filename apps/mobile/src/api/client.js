// Default API URL for mobile.
// Android Emulator uses 10.0.2.2 to access host machine localhost.
// Physical device uses your computer's local Wi-Fi IP (e.g. http://192.168.1.50:5000/api/v1).
let API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api/v1';

let authToken = null;

export const setMobileApiUrl = (url) => {
  if (url) API_BASE = url.replace(/\/$/, '');
};

export const getMobileApiUrl = () => API_BASE;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const mobileRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Check backend server IP address.');
    }
    throw error;
  }
};

export const mobileApi = {
  // Weather
  searchCities: (q) => mobileRequest(`/weather/search?q=${encodeURIComponent(q)}`),
  getForecast: (lat, lon, timezone = 'auto') =>
    mobileRequest(`/weather/forecast?lat=${lat}&lon=${lon}&timezone=${timezone}`),
  getAirQuality: (lat, lon) => mobileRequest(`/weather/air-quality?lat=${lat}&lon=${lon}`),

  // Auth
  login: (email, password) =>
    mobileRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    mobileRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  getMe: () => mobileRequest('/auth/me'),

  // Favorites
  getFavorites: () => mobileRequest('/users/favorites'),
  addFavorite: (city) =>
    mobileRequest('/users/favorites', {
      method: 'POST',
      body: JSON.stringify(city),
    }),
  removeFavorite: (id) =>
    mobileRequest(`/users/favorites/${id}`, {
      method: 'DELETE',
    }),
  updateSettings: (settings) =>
    mobileRequest('/users/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),
};
