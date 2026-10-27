import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { formatTemp } from '../utils/units.js';
import { api } from '../api/client.js';

// Landmark badges with distinctive gradients and emojis/icons matching showcase
const CITY_LANDMARKS = {
  'new york': { landmark: '🗽', bg: 'from-blue-600/30 to-cyan-500/30' },
  'london': { landmark: '🎡', bg: 'from-indigo-600/30 to-blue-500/30' },
  'tokyo': { landmark: '🗼', bg: 'from-purple-600/30 to-pink-500/30' },
  'mumbai': { landmark: '🏛️', bg: 'from-amber-600/30 to-orange-500/30' },
  'paris': { landmark: '🗼', bg: 'from-sky-600/30 to-indigo-500/30' },
  'sydney': { landmark: '⛵', bg: 'from-teal-600/30 to-cyan-500/30' },
  'delhi': { landmark: '🕌', bg: 'from-orange-600/30 to-red-500/30' },
};

export const SavedCitiesWidget = ({
  favorites = [],
  onSelectCity,
  onViewAll,
  unit,
  currentCityName,
}) => {
  const defaultCities = [
    { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006, temp: 22 },
    { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, temp: 16 },
    { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, temp: 18 },
    { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, temp: 32 },
  ];

  const displayList = favorites.length > 0 ? favorites.slice(0, 4) : defaultCities;
  const [temps, setTemps] = useState({});

  // Fetch live temperatures for displayed cities
  useEffect(() => {
    let isMounted = true;
    displayList.forEach(async (city) => {
      try {
        const res = await api.getForecast(city.latitude, city.longitude);
        if (isMounted && res.data?.current?.temperature !== undefined) {
          setTemps((prev) => ({
            ...prev,
            [city.name.toLowerCase()]: res.data.current.temperature,
          }));
        }
      } catch (e) {
        // Fallback to static temp if offline
      }
    });
    return () => {
      isMounted = false;
    };
  }, [favorites]);

  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">Saved Cities</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {displayList.map((item, idx) => {
          const isCurrent =
            currentCityName &&
            item.name.toLowerCase() === currentCityName.toLowerCase();

          const landmarkInfo = CITY_LANDMARKS[item.name.toLowerCase()] || {
            landmark: '🏙️',
            bg: 'from-slate-700/40 to-slate-800/40',
          };

          const cityTemp = temps[item.name.toLowerCase()] ?? item.temp ?? 22;

          return (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => onSelectCity(item)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                isCurrent
                  ? 'bg-blue-600/25 border-cyan-400/50 shadow-glow'
                  : 'bg-slate-800/30 hover:bg-slate-800/70 border-slate-700/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${landmarkInfo.bg} border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-sm`}
                >
                  {landmarkInfo.landmark}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.country || 'Region'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-xl border border-cyan-500/30 shadow-sm">
                  {formatTemp(cityTemp, unit)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
