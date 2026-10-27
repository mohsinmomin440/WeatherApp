import React from 'react';
import { Sunrise, Sunset, SunMedium, Eye } from 'lucide-react';

export const HighlightsCard = ({ highlights, loading }) => {
  if (loading || !highlights) {
    return (
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Today's Highlights</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const {
    sunrise = '06:12 AM',
    sunset = '07:45 PM',
    uvIndex = 3,
    uvCategory = 'Moderate',
    visibilityKm = 10,
  } = highlights;

  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
      <h3 className="text-base font-bold text-white mb-4 tracking-tight">
        Today's Highlights
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Sunrise */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Sunrise className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Sunrise</p>
            <p className="text-sm font-bold text-white">{sunrise}</p>
          </div>
        </div>

        {/* Sunset */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
            <Sunset className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Sunset</p>
            <p className="text-sm font-bold text-white">{sunset}</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
            <SunMedium className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">UV Index</p>
            <p className="text-sm font-bold text-white">
              {uvIndex} <span className="text-xs font-normal text-yellow-300">({uvCategory})</span>
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Visibility</p>
            <p className="text-sm font-bold text-white">{visibilityKm} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};
