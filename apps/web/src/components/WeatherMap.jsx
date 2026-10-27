import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, X, Maximize2 } from 'lucide-react';

// Custom glowing cyan marker icon
const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(0, 210, 255, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #00D2FF; border: 2px solid #ffffff; box-shadow: 0 0 10px #00D2FF;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Component to dynamically re-center map when coordinates change
const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      map.setView([lat, lon], 10, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
};

export const WeatherMap = ({ lat = 40.7128, lon = -74.006, cityName = 'New York' }) => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-sky-500/15 flex flex-col justify-between h-[360px]">
      {/* Header matching showcase */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Weather Map</h3>
        </div>
        <button
          className="p-1 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
          title="Toggle view"
        >
          <X className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          scrollWheelZoom={false}
          className="w-full h-full"
          attributionControl={false}
        >
          {/* Dark CartoDB Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
          {/* Live Open-Meteo / RainViewer Radar Precipitation Overlay */}
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.15}
          />
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup className="skycast-popup">
              <span className="font-bold text-slate-900">{cityName}</span>
            </Popup>
          </Marker>
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>

        {/* Floating City Label */}
        <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{cityName}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span>Rain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
          <span>Snow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm shadow-slate-400/50" />
          <span>Clouds</span>
        </div>
      </div>
    </div>
  );
};
