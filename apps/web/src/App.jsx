import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { TopBar } from './components/TopBar.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { FavoritesPage } from './pages/FavoritesPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { api, setToken, getToken } from './api/client.js';

const DEFAULT_CITY = {
  name: 'New York',
  country: 'USA',
  admin1: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
};

export const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const [unit, setUnit] = useState(() => localStorage.getItem('skycast_unit') || 'celsius');
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load User profile on mount if token exists
  useEffect(() => {
    const checkUser = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
          if (res.user.favorites) setFavorites(res.user.favorites);
          if (res.user.settings?.unit) setUnit(res.user.settings.unit);
        }
      } catch (err) {
        console.warn('Failed to restore session:', err.message);
        setToken(null);
      }
    };
    checkUser();
  }, []);

  // Fetch Weather and Air Quality data whenever currentCity changes
  const loadWeather = useCallback(async (city) => {
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const forecastRes = await api.getForecast(
        city.latitude,
        city.longitude,
        city.timezone || 'auto'
      );
      setWeatherData(forecastRes.data);

      // Fetch Air Quality non-blockingly
      api
        .getAirQuality(city.latitude, city.longitude)
        .then((aqiRes) => setAirQualityData(aqiRes.data))
        .catch(() => setAirQualityData(null));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setWeatherError(err.message || 'Unable to fetch weather forecast.');
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  // Unit Toggle handler
  const handleToggleUnit = () => {
    const nextUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(nextUnit);
    localStorage.setItem('skycast_unit', nextUnit);
    if (user) {
      api.updateSettings({ unit: nextUnit }).catch(console.error);
    }
  };

  const handleUpdateUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('skycast_unit', newUnit);
    if (user) {
      api.updateSettings({ unit: newUnit }).catch(console.error);
    }
  };

  // City selection from search or saved cities
  const handleSelectCity = (city) => {
    setCurrentCity({
      name: city.name,
      country: city.country || '',
      admin1: city.admin1 || '',
      latitude: parseFloat(city.latitude),
      longitude: parseFloat(city.longitude),
      timezone: city.timezone || 'auto',
    });
    setActiveTab('home');
  };

  // Check if currentCity is already in favorites
  const isCurrentFavorite = favorites.some(
    (f) =>
      (Math.abs(f.latitude - currentCity.latitude) < 0.05 &&
        Math.abs(f.longitude - currentCity.longitude) < 0.05) ||
      (f.name.toLowerCase() === currentCity.name.toLowerCase() &&
        f.country?.toLowerCase() === currentCity.country?.toLowerCase())
  );

  // Toggle favorite city
  const handleToggleFavorite = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (isCurrentFavorite) {
      const match = favorites.find(
        (f) =>
          (Math.abs(f.latitude - currentCity.latitude) < 0.05 &&
            Math.abs(f.longitude - currentCity.longitude) < 0.05) ||
          f.name.toLowerCase() === currentCity.name.toLowerCase()
      );
      if (match) {
        try {
          const res = await api.removeFavorite(match.id || match._id);
          setFavorites(res.data);
        } catch (err) {
          console.error('Failed to remove favorite:', err);
        }
      }
    } else {
      try {
        const res = await api.addFavorite(currentCity);
        setFavorites(res.data);
      } catch (err) {
        console.error('Failed to add favorite:', err);
      }
    }
  };

  const handleRemoveFavorite = async (id) => {
    if (!user) {
      setFavorites(favorites.filter((f) => (f.id || f._id) !== id));
      return;
    }
    try {
      const res = await api.removeFavorite(id);
      setFavorites(res.data);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopBar
          onSelectCity={handleSelectCity}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {weatherError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
              <span>{weatherError}</span>
              <button
                onClick={() => loadWeather(currentCity)}
                className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl font-bold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {activeTab === 'home' && (
            <Dashboard
              city={currentCity}
              weather={weatherData}
              airQuality={airQualityData}
              unit={unit}
              favorites={favorites}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onSelectCity={handleSelectCity}
              onViewAllFavorites={() => setActiveTab('favorites')}
              loading={loadingWeather}
            />
          )}

          {activeTab === 'search' && (
            <SearchPage
              onSelectCity={handleSelectCity}
              unit={unit}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesPage
              favorites={favorites}
              onSelectCity={handleSelectCity}
              onRemoveFavorite={handleRemoveFavorite}
              onOpenSearch={() => setActiveTab('search')}
              unit={unit}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              unit={unit}
              onUpdateUnit={handleUpdateUnit}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 border-t border-slate-800/60 text-center text-xs text-slate-500">
          <p>
            SkyCast — Smart Weather Forecasting Platform · BCA Final-Year Project 2026
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Powered by Open-Meteo API & Node.js/Express REST Engine
          </p>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          if (authUser.favorites) setFavorites(authUser.favorites);
          if (authUser.settings?.unit) setUnit(authUser.settings.unit);
        }}
      />
    </div>
  );
};

export default App;
