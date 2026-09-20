import React, { useState, useEffect } from 'react';
import { CelestialBodyTarget } from './CosmicCanvas';

interface CelestialTargetPinsProps {
  targets: CelestialBodyTarget[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
}

export const CelestialTargetPins: React.FC<CelestialTargetPinsProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Smooth real-time distance countdown (matches Voyager 1 speed: 17 km per second)
  const [liveDistanceKm, setLiveDistanceKm] = useState<number>(6054558190);

  useEffect(() => {
    // Smoothly increment distance by 17 km every second with micro-ticks
    const timer = setInterval(() => {
      setLiveDistanceKm((prev) => prev + 17);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {targets.map((target) => {
        if (!target.screenPos.visible) return null;
        const isHovered = hoveredId === target.id;
        const isSelected = selectedTargetId === target.id;
        const isEarth = target.id === 'earth';

        return (
          <div
            key={target.id}
            style={{
              transform: `translate3d(${target.screenPos.x}px, ${target.screenPos.y}px, 0)`
            }}
            className="absolute -top-3 -left-3 pointer-events-auto transition-transform duration-75"
          >
            {/* The Reticle & Delicate Hairline Connector */}
            <div
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectTarget(target.id)}
              className="relative flex items-center cursor-pointer group"
            >
              {/* Central Optical Dot */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Subtle Breathing Halo for Earth */}
                {isEarth && (
                  <span className="absolute inset-0 rounded-full border border-[#89cff0]/40 animate-ping duration-[3000ms] pointer-events-none" />
                )}

                {/* Core Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isEarth
                      ? 'bg-[#89cff0] shadow-[0_0_8px_#89cff0]'
                      : isHovered
                      ? 'bg-amber-300 shadow-[0_0_8px_#fcd34d]'
                      : 'bg-white/50 group-hover:bg-white'
                  }`}
                />

                {/* Ultra-fine Dashed Outer Ring */}
                <span
                  className={`absolute inset-0.5 rounded-full border border-dashed transition-all duration-500 ${
                    isEarth
                      ? 'border-[#89cff0]/60 scale-110 opacity-80'
                      : isSelected
                      ? 'border-cyan-400 scale-125 opacity-100'
                      : isHovered
                      ? 'border-white/60 scale-110 opacity-90'
                      : 'border-white/20 scale-95 opacity-30 group-hover:opacity-60'
                  }`}
                />
              </div>

              {/* Elegant Hairline Lead Line */}
              <div
                className={`h-px transition-all duration-300 ${
                  isEarth
                    ? 'w-6 bg-gradient-to-r from-[#89cff0]/60 to-[#89cff0]/20'
                    : isHovered
                    ? 'w-5 bg-white/40'
                    : 'w-3 bg-white/15'
                }`}
              />

              {/* Minimalist Editorial Label (Zero Bulky Boxes, Pure Poetry) */}
              <div
                className={`pl-1.5 transition-all duration-300 ${
                  isHovered || isSelected
                    ? 'opacity-100 translate-x-0'
                    : isEarth
                    ? 'opacity-85 translate-x-0'
                    : 'opacity-0 -translate-x-1 group-hover:opacity-75 group-hover:translate-x-0'
                }`}
              >
                {isEarth ? (
                  <div className="flex flex-col">
                    {/* Poetic Serif Title */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif italic text-sm text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] tracking-wide">
                        Earth
                      </span>
                      <span className="font-mono text-[9px] text-[#89cff0]/90 tracking-wider">
                        · 0.12 px
                      </span>
                    </div>

                    {/* Smooth Live Distance Countdown */}
                    <div className="font-mono text-[8px] text-slate-400 tracking-wider flex items-center gap-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                      <span className="text-[#89cff0]/70 tabular-nums">
                        {liveDistanceKm.toLocaleString()} km
                      </span>
                      <span className="text-[7px] text-slate-500 uppercase">
                        (~40.47 AU)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                    <span className="font-serif italic text-xs text-slate-200">
                      {target.name.toLowerCase()}
                    </span>
                    <span className="font-mono text-[8px] text-[#89cff0]/80">
                      {target.distance}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
