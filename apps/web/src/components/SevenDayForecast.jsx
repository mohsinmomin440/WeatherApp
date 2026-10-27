import React from 'react';
import { WeatherIcon } from './WeatherIcon.jsx';
import { formatTemp } from '../utils/units.js';

export const SevenDayForecast = ({ daily = [], unit, loading }) => {
  if (loading || !daily || daily.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
        <h3 className="text-base font-bold text-white mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-32 bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
      <h3 className="text-base font-bold text-white mb-4 tracking-tight">
        7-Day Forecast
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 overflow-x-auto pb-2">
        {daily.map((day, idx) => (
          <div
            key={`${day.date}-${idx}`}
            className="flex flex-col items-center justify-between p-3.5 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 transition-all text-center min-w-[90px]"
          >
            <div>
              <p className="text-xs font-bold text-white">{day.dayName}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{day.formattedDate}</p>
            </div>

            <div className="my-3 p-2 rounded-xl bg-slate-800/50">
              <WeatherIcon code={day.weatherCode} className="w-7 h-7" />
            </div>

            <div className="text-xs font-semibold text-slate-200">
              <span className="text-white font-bold">{formatTemp(day.maxTemp, unit)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">{formatTemp(day.minTemp, unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
