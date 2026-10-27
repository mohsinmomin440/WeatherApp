import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, History, Sparkles, Loader2, Globe } from 'lucide-react';
import { api } from '../api/client.js';
import { formatTemp } from '../utils/units.js';

export const SearchPage = ({ onSelectCity, unit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularCities = [
    { name: 'New York', country: 'USA', admin1: 'New York', latitude: 40.7128, longitude: -74.006, temp: 22 },
    { name: 'London', country: 'UK', admin1: 'Greater London', latitude: 51.5074, longitude: -0.1278, temp: 16 },
    { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, temp: 18 },
    { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, temp: 32 },
  ];

  const recentSearches = [
    { name: 'Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209, temp: 34 },
    { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, temp: 20 },
  ];

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchCities(query);
        setResults(res.data || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Input Hero */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/20">
        <h2 className="text-xl font-bold text-white mb-2">Find Weather Forecasts Anywhere</h2>
        <p className="text-xs text-slate-400 mb-4">
          Search over 200,000+ global cities, towns, and territories with live Open-Meteo geocoding.
        </p>

        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Enter city name (e.g. Paris, Ahmedabad, Tokyo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 border border-sky-500/30 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-4 w-5 h-5 text-cyan-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Query Search Results */}
      {query.trim().length >= 2 && (
        <div className="glass-card rounded-3xl p-6 border border-sky-500/20">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Search Results for "{query}"</span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Searching Open-Meteo Geocoding Database...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {results.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  onClick={() => onSelectCity(city)}
                  className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-cyan-300">
                        {city.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')} (Elev: {city.elevation ?? 0}m)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching locations found for "{query}". Try checking the spelling.
            </div>
          )}
        </div>
      )}

      {/* Popular Cities (matching Showcase) */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Popular Global Cities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularCities.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-900/40 to-blue-900/40 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-300">
                    {city.name}
                  </p>
                  <p className="text-xs text-slate-400">{city.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-cyan-300">
                  {formatTemp(city.temp, unit)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span>Recent Searches</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentSearches.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-cyan-300">
                    {city.name}
                  </p>
                  <p className="text-xs text-slate-400">{city.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-cyan-300">
                  {formatTemp(city.temp, unit)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
