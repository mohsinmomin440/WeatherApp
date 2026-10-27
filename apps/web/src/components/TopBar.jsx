import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, MapPin, Loader2, Sun } from 'lucide-react';
import { api } from '../api/client.js';

export const TopBar = ({
  onSelectCity,
  unit,
  onToggleUnit,
  onOpenMobileMenu,
  alertCount = 1,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const searchRef = useRef(null);

  // Debounced live city search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchCities(searchQuery);
        setResults(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('City search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityClick = (city) => {
    onSelectCity(city);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 bg-[#0B132B]/80 backdrop-blur-md border-b border-sky-500/10">
      {/* Mobile Menu Button */}
      <button
        onClick={onOpenMobileMenu}
        className="p-2 lg:hidden text-slate-300 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/50"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Input with Live Dropdown */}
      <div className="relative flex-1 max-w-xl" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            className="w-full pl-11 pr-10 py-2.5 bg-[#111C38] border border-sky-500/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
          {loading && (
            <Loader2 className="absolute right-4 w-4 h-4 text-cyan-400 animate-spin" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#111C38] border border-sky-500/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-sky-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-cyan-300">
                        {city.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-slate-400">
                No cities found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Unit/Theme Pill Toggle & Notifications (matching showcase) */}
      <div className="flex items-center gap-3">
        {/* Toggle Pill Switch with Sun Icon */}
        <button
          onClick={onToggleUnit}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111C38] border border-sky-500/20 hover:border-cyan-400/50 rounded-full transition-all shadow-sm group"
          title={`Click to switch to ${unit === 'celsius' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
        >
          <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <div className="w-9 h-5 bg-slate-800 rounded-full p-0.5 border border-slate-700/60 flex items-center transition-colors">
            <div
              className={`w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-glow transition-transform duration-200 ease-out ${
                unit === 'fahrenheit' ? 'translate-x-4 bg-sky-300' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-xs font-bold text-slate-300">
            {unit === 'celsius' ? '°C' : '°F'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowAlertModal(!showAlertModal)}
            className="relative p-2.5 bg-[#111C38] border border-sky-500/20 hover:border-cyan-400/50 rounded-2xl text-slate-300 hover:text-white transition-all"
            aria-label="Weather notifications"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            )}
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showAlertModal && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#111C38] border border-sky-500/20 rounded-2xl shadow-2xl p-4 z-50 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Weather Insights & Alerts
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Live Open-Meteo forecasts active. Weather data updates continuously based on local coordinates.
              </p>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                Tip: Click any saved city to load its hourly and 7-day outlook.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
