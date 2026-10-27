import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen.js';
import { LoginScreen } from './src/screens/LoginScreen.js';
import { HomeScreen } from './src/screens/HomeScreen.js';
import { SearchScreen } from './src/screens/SearchScreen.js';
import { SavedCitiesScreen } from './src/screens/SavedCitiesScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { BottomNavBar } from './src/components/BottomNavBar.js';
import { mobileApi, setAuthToken } from './src/api/client.js';

const DEFAULT_CITY = {
  name: 'New York',
  country: 'USA',
  admin1: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'login', 'main'
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'favorites', 'settings'
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('celsius');
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch forecast data
  const loadForecast = useCallback(async (city) => {
    setLoading(true);
    try {
      const res = await mobileApi.getForecast(
        city.latitude,
        city.longitude,
        city.timezone || 'auto'
      );
      setWeatherData(res.data);
    } catch (err) {
      console.warn('Weather fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentScreen === 'main') {
      loadForecast(currentCity);
    }
  }, [currentCity, currentScreen, loadForecast]);

  const handleCitySelect = (city) => {
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

  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
  };

  const handleRemoveFavorite = async (id) => {
    if (user) {
      try {
        const res = await mobileApi.removeFavorite(id);
        setFavorites(res.data);
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    } else {
      setFavorites(favorites.filter((f) => (f.id || f._id) !== id));
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setFavorites([]);
    Alert.alert('Logged Out', 'You have been logged out.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

      {/* Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onGetStarted={() => {
            setCurrentScreen('main');
            loadForecast(currentCity);
          }}
          onLoginPress={() => setCurrentScreen('login')}
        />
      )}

      {/* Login Screen */}
      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={(authUser) => {
            setUser(authUser);
            if (authUser.favorites) setFavorites(authUser.favorites);
            setCurrentScreen('main');
            loadForecast(currentCity);
          }}
          onCancel={() => setCurrentScreen('main')}
        />
      )}

      {/* Main Dashboard Screens */}
      {currentScreen === 'main' && (
        <View style={styles.mainView}>
          <View style={styles.screenContent}>
            {activeTab === 'home' && (
              <HomeScreen
                city={currentCity}
                weather={weatherData}
                loading={loading}
                unit={unit}
                onRefresh={() => loadForecast(currentCity)}
                onOpenNotifications={() =>
                  Alert.alert(
                    'Weather Alert',
                    'Open-Meteo real-time atmospheric forecast connected and functioning normally.'
                  )
                }
                onViewAllForecast={() => setActiveTab('favorites')}
              />
            )}

            {activeTab === 'search' && (
              <SearchScreen
                onSelectCity={handleCitySelect}
                unit={unit}
              />
            )}

            {activeTab === 'favorites' && (
              <SavedCitiesScreen
                favorites={favorites}
                onSelectCity={handleCitySelect}
                onRemoveFavorite={handleRemoveFavorite}
                onBack={() => setActiveTab('home')}
                unit={unit}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                unit={unit}
                onToggleUnit={handleToggleUnit}
                user={user}
                onLogout={handleLogout}
                onLoginPress={() => setCurrentScreen('login')}
              />
            )}
          </View>

          {/* Persistent Bottom Tab Bar */}
          <BottomNavBar
            activeTab={activeTab}
            onTabPress={(tabId) => setActiveTab(tabId)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  mainView: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
});
