import React, { useState } from 'react';
import { Heart, Trash2, MapPin, Plus, ExternalLink, Globe } from 'lucide-react';
import { formatTemp } from '../utils/units.js';

export const FavoritesPage = ({
  favorites = [],
  onSelectCity,
  onRemoveFavorite,
  onOpenSearch,
  unit,
}) => {
  const [filterText, setFilterText] = useState('');

  const filtered = favorites.filter((city) =>
    city.name.toLowerCase().includes(filterText.toLowerCase()) ||
    city.country?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Favorite Cities</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal list of tracked cities and destinations ({favorites.length}/20)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter saved cities..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-4 py-2 bg-[#111C38] border border-sky-500/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Grid of Favorite Cities */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((city, idx) => (
            <div
              key={city.id || city._id || idx}
              className="glass-card rounded-2xl p-5 border border-sky-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ') || 'Global'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(city.id || city._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                  <span>Coordinates: {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°</span>
                  <span className="text-cyan-400 font-bold">Tracked</span>
                </div>
              </div>

              <button
                onClick={() => onSelectCity(city)}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>View Full Forecast</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-slate-700/60">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Favorite Cities Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Search for any city using the top search bar and tap the heart icon to save it here for quick access.
          </p>
          <button
            onClick={onOpenSearch}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Search Cities Now
          </button>
        </div>
      )}
    </div>
  );
};
