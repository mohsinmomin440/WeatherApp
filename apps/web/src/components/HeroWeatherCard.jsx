import React from 'react';
import { MapPin, Heart, Compass, Droplets, Wind, Gauge, ChevronDown } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon.jsx';
import { formatTemp, formatSpeed } from '../utils/units.js';

export const HeroWeatherCard = ({
  city,
  weather,
  unit,
  isFavorite,
  onToggleFavorite,
  loading,
}) => {
  if (loading || !weather) {
    return (
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden animate-pulse h-80 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-700/50 rounded-lg"></div>
            <div className="h-4 w-28 bg-slate-700/30 rounded-lg"></div>
          </div>
          <div className="w-10 h-10 bg-slate-700/40 rounded-2xl"></div>
        </div>
        <div className="flex items-center gap-6 my-6">
          <div className="w-20 h-20 bg-slate-700/50 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-12 w-32 bg-slate-700/60 rounded-xl"></div>
            <div className="h-5 w-24 bg-slate-700/40 rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-700/40">
          <div className="h-10 bg-slate-700/30 rounded-lg"></div>
          <div className="h-10 bg-slate-700/30 rounded-lg"></div>
          <div className="h-10 bg-slate-700/30 rounded-lg"></div>
          <div className="h-10 bg-slate-700/30 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const { current } = weather;
  const locationName = city?.name || 'Selected Location';
  const countryName = city?.country || '';
  const lastUpdated = current?.time
    ? new Date(current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-sky-500/20 group">
      {/* Background City Silhouette and Cyan Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-cyan-900/10 to-transparent pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* City Skyline Silhouette SVG Art in Background */}
      <svg
        className="absolute right-0 bottom-12 w-3/5 h-44 opacity-20 pointer-events-none select-none"
        viewBox="0 0 500 200"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0,200 L0,150 L20,150 L20,170 L35,170 L35,120 L55,120 L55,200 L70,200 L70,90 L95,90 L95,200 L110,200 L110,60 L130,60 L130,20 L135,20 L135,60 L150,60 L150,200 L170,200 L170,110 L195,110 L195,200 L220,200 L220,130 L250,130 L250,200 L275,200 L275,80 L290,40 L305,80 L305,200 L330,200 L330,140 L355,140 L355,200 L380,200 L380,100 L410,100 L410,200 L430,200 L430,150 L460,150 L460,200 L500,200 Z" />
      </svg>

      {/* Top row: Location & Favorite Button */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {locationName}{countryName ? `, ${countryName}` : ''}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 pl-7">
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        <button
          onClick={onToggleFavorite}
          className={`p-3 rounded-2xl transition-all ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-700/50'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Center: Hero Temp & Weather Icon */}
      <div className="relative z-10 flex items-center justify-between my-8">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md shadow-inner">
            <WeatherIcon
              code={current?.weatherCode}
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              {formatTemp(current?.temperature, unit)}
            </div>
            <p className="text-lg md:text-xl font-semibold text-cyan-300 mt-1">
              {current?.condition || 'Clear Sky'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Stats Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/50 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Feels like</p>
            <p className="text-sm font-bold text-white">
              {formatTemp(current?.feelsLike, unit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Wind</p>
            <p className="text-sm font-bold text-white">
              {formatSpeed(current?.windSpeed, unit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Humidity</p>
            <p className="text-sm font-bold text-white">
              {current?.humidity ?? '--'}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Pressure</p>
            <p className="text-sm font-bold text-white">
              {current?.pressure ?? '--'} hPa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
