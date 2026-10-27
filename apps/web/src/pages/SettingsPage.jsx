import React, { useState } from 'react';
import { Settings, Thermometer, ShieldCheck, Database, Info, User, Check } from 'lucide-react';

export const SettingsPage = ({
  unit,
  onUpdateUnit,
  user,
  onOpenAuth,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUnitChange = (newUnit) => {
    onUpdateUnit(newUnit);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>Platform Settings & Preferences</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your unit conventions, view account profile, and inspect system telemetry
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Temperature Unit Preferences */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Temperature Unit</h2>
            <p className="text-xs text-slate-400">
              Select your preferred unit for current conditions, hourly forecasts, and 7-day outlook
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <button
            onClick={() => handleUnitChange('celsius')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              unit === 'celsius'
                ? 'bg-blue-600/20 border-cyan-400 shadow-glow'
                : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-white">Metric (°C, km/h)</span>
              {unit === 'celsius' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400">
              Celsius for temperatures, kilometers per hour for wind speed, and hPa for barometric pressure.
            </p>
          </button>

          <button
            onClick={() => handleUnitChange('fahrenheit')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              unit === 'fahrenheit'
                ? 'bg-blue-600/20 border-cyan-400 shadow-glow'
                : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-white">Imperial (°F, mph)</span>
              {unit === 'fahrenheit' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400">
              Fahrenheit for temperatures, miles per hour for wind speed.
            </p>
          </button>
        </div>
      </div>

      {/* Account Profile Card */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Account Profile</h2>
            <p className="text-xs text-slate-400">
              Manage your authenticated credentials and synchronized cloud preferences
            </p>
          </div>
        </div>

        {user ? (
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-base">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
                <p className="text-[10px] text-cyan-400 mt-0.5">Session Active · JWT Secured</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                Verified Account
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-800/30 border border-dashed border-slate-700 text-center">
            <p className="text-xs text-slate-300 mb-3">
              You are currently using SkyCast in guest mode. Log in to sync up to 20 favorite locations across web and Android.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-glow transition-all"
            >
              Sign In or Create Account
            </button>
          </div>
        )}
      </div>

      {/* Architecture & Provider Attribution */}
      <div className="glass-card rounded-3xl p-6 border border-sky-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">System Architecture & Attribution</h2>
            <p className="text-xs text-slate-400">Technical specifications for BCA final-year project evaluation</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Weather Provider</span>
            <span className="font-semibold text-white">Open-Meteo Forecast & Geocoding API</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Backend Runtime</span>
            <span className="font-semibold text-white">Node.js LTS + Express REST API</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Database Engine</span>
            <span className="font-semibold text-white">MongoDB + Mongoose ODM (Atlas / Local)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Frontend Technology</span>
            <span className="font-semibold text-white">React + Vite + Tailwind CSS + Leaflet</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Mobile Technology</span>
            <span className="font-semibold text-white">React Native + Expo SDK 52</span>
          </div>
        </div>
      </div>
    </div>
  );
};
