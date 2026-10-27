import React from 'react';
import { HeroWeatherCard } from '../components/HeroWeatherCard.jsx';
import { HighlightsCard } from '../components/HighlightsCard.jsx';
import { SavedCitiesWidget } from '../components/SavedCitiesWidget.jsx';
import { SevenDayForecast } from '../components/SevenDayForecast.jsx';
import { WeatherMap } from '../components/WeatherMap.jsx';
import { HourlyForecast } from '../components/HourlyForecast.jsx';
import { WeatherInsights } from '../components/WeatherInsights.jsx';

export const Dashboard = ({
  city,
  weather,
  airQuality,
  unit,
  favorites,
  isFavorite,
  onToggleFavorite,
  onSelectCity,
  onViewAllFavorites,
  loading,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Main Section: Hero Card + (Highlights & Saved Cities) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hero Weather Card & Hourly Forecast (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <HeroWeatherCard
            city={city}
            weather={weather}
            unit={unit}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            loading={loading}
          />

          <HourlyForecast
            hourly={weather?.hourly}
            unit={unit}
            loading={loading}
          />
        </div>

        {/* Right Column: Highlights & Saved Cities Widgets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <HighlightsCard
            highlights={weather?.todayHighlights}
            loading={loading}
          />

          <SavedCitiesWidget
            favorites={favorites}
            onSelectCity={onSelectCity}
            onViewAll={onViewAllFavorites}
            unit={unit}
            currentCityName={city?.name}
          />
        </div>
      </div>

      {/* Weather Insights Banner */}
      <WeatherInsights
        insights={weather?.insights}
        airQuality={airQuality}
      />

      {/* Bottom Section: 7-Day Forecast & Weather Radar Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Forecast (7 cols) */}
        <div className="lg:col-span-7">
          <SevenDayForecast
            daily={weather?.daily}
            unit={unit}
            loading={loading}
          />
        </div>

        {/* Weather Map (5 cols) */}
        <div className="lg:col-span-5">
          <WeatherMap
            lat={city?.latitude ?? 40.7128}
            lon={city?.longitude ?? -74.006}
            cityName={city?.name ?? 'New York'}
          />
        </div>
      </div>
    </div>
  );
};
