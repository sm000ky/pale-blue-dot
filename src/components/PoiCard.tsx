import React from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';
import { PlanetPOI } from './CosmicCanvas';

interface PoiCardProps {
  poi: PlanetPOI;
  onClose: () => void;
}

export const PoiCard: React.FC<PoiCardProps> = ({ poi, onClose }) => {
  return (
    <div className="absolute top-20 left-6 md:left-8 z-30 max-w-sm w-full bg-[#0a0f1c]/85 backdrop-blur-md border border-[#89cff0]/30 rounded-2xl p-4 shadow-2xl animate-fadeIn text-slate-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#89cff0]/20 flex items-center justify-center text-[#89cff0]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white tracking-wide">
              {poi.name}
            </div>
            <div className="font-mono text-[9px] text-[#89cff0]">
              {poi.jpName}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-[#141b2c] hover:bg-[#1f2a44] text-slate-400 hover:text-white transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="font-serif text-xs text-slate-300 leading-relaxed mt-2 border-t border-white/10 pt-2">
        {poi.description}
      </p>

      <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 mt-3 pt-2 border-t border-white/5">
        <span>LAT: {poi.lat.toFixed(2)}°</span>
        <span>LON: {poi.lon.toFixed(2)}°</span>
        <span className="text-[#89cff0] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> EARTH MATRIX
        </span>
      </div>
    </div>
  );
};
