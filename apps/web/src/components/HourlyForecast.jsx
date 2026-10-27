import React from 'react';
import { WeatherIcon } from './WeatherIcon.jsx';
import { formatTemp } from '../utils/units.js';
import { Clock } from 'lucide-react';

export const HourlyForecast = ({ hourly = [], unit, loading }) => {
  if (loading || !hourly || hourly.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
        <h3 className="text-base font-bold text-white mb-4">Hourly Forecast</h3>
        <div className="grid grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Next 12 hours for responsive desktop/tablet
  const displayHours = hourly.slice(0, 10);

  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h3 className="text-base font-bold text-white tracking-tight">
          Hourly Forecast (Next 24h)
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {displayHours.map((slot, idx) => (
          <div
            key={`${slot.time}-${idx}`}
            className="flex flex-col items-center justify-between p-3.5 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 min-w-[76px] transition-all"
          >
            <p className="text-xs font-semibold text-slate-300">{slot.label}</p>
            <div className="my-2 p-1.5 rounded-xl bg-slate-800/50">
              <WeatherIcon code={slot.weatherCode} className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">
              {formatTemp(slot.temperature, unit)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
