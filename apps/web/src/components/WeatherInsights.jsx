import React from 'react';
import { Sparkles, AlertTriangle, Info, CheckCircle2, Wind } from 'lucide-react';

export const WeatherInsights = ({ insights = [], airQuality }) => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Smart Weather Insights</h3>
        </div>
        {airQuality && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: airQuality.color }}
            />
            <span className="font-semibold text-slate-200">
              AQI: {airQuality.aqi} ({airQuality.category})
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.length > 0 ? (
          insights.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                item.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : item.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
              }`}
            >
              {item.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : item.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30 text-xs text-slate-400 text-center">
            Standard atmospheric conditions detected. No extreme weather hazards expected today.
          </div>
        )}
      </div>
    </div>
  );
};
