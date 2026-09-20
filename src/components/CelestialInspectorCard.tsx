import React from 'react';
import { X, Globe2, Compass, Sparkles, Radio, Info, MapPin } from 'lucide-react';
import { CelestialBodyInfo } from '../data/celestialData';
import { PLANET_POIS, PlanetPOI } from './CosmicCanvas';

interface CelestialInspectorCardProps {
  info: CelestialBodyInfo;
  onClose: () => void;
  onSelectPoi?: (poi: PlanetPOI) => void;
}

export const CelestialInspectorCard: React.FC<CelestialInspectorCardProps> = ({
  info,
  onClose,
  onSelectPoi
}) => {
  const isEarth = info.id === 'earth';

  return (
    <div className="absolute top-16 right-4 md:right-7 z-30 max-w-sm w-full bg-[#080d1a]/85 backdrop-blur-md border border-[#89cff0]/30 rounded-2xl p-4 shadow-2xl animate-fadeIn text-slate-200 select-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#89cff0]/15 border border-[#89cff0]/30 flex items-center justify-center text-[#89cff0]">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white tracking-wider">
                {info.name}
              </span>
              <span className="px-1.5 py-0.2 rounded font-mono text-[8px] uppercase tracking-widest bg-white/10 text-[#89cff0]">
                {info.category}
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
              {info.jpName}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="py-3 space-y-3 font-mono text-xs">
        {/* Tagline */}
        <p className="font-serif italic text-sm text-[#89cff0] leading-snug">
          &ldquo;{info.tagline}&rdquo;
        </p>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-black/40 border border-white/5 text-[10px]">
          <div>
            <span className="text-slate-500 uppercase text-[8px] block">VOYAGER DISTANCE</span>
            <strong className="text-white">{info.distanceVoyager}</strong>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[8px] block">DIAMETER</span>
            <strong className="text-white">{info.diameter}</strong>
          </div>
        </div>

        {/* Scientific Facts */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-2.5 h-2.5 text-[#89cff0]" />
            <span>Telemetry & Optics</span>
          </div>
          <ul className="space-y-1 text-[10px] text-slate-300 leading-relaxed pl-1">
            {info.facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#89cff0]">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Voyager Mission Note */}
        <div className="p-2.5 rounded-xl bg-[#0e1628]/80 border border-white/10 text-[10px] text-slate-300 leading-relaxed">
          <span className="text-[#f3c66f] font-semibold block mb-0.5">
            Mission Log (1990):
          </span>
          {info.voyagerStory}
        </div>

        {/* If Earth, show Interactive Surface POIs */}
        {isEarth && onSelectPoi && (
          <div className="pt-2 border-t border-white/10">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1 font-semibold mb-2">
              <MapPin className="w-2.5 h-2.5 text-cyan-400" />
              <span>Explore Earth Coordinates</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PLANET_POIS.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => onSelectPoi(poi)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[9px] text-slate-200 hover:text-white transition-all flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  <span>{poi.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
