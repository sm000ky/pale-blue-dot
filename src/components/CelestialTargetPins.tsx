import React, { useState } from 'react';
import { CelestialBodyTarget } from './CosmicCanvas';

interface CelestialTargetPinsProps {
  targets: CelestialBodyTarget[];
  onSelectTarget?: (id: string) => void;
}

export const CelestialTargetPins: React.FC<CelestialTargetPinsProps> = ({
  targets,
  onSelectTarget
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {targets.map((target) => {
        if (!target.screenPos.visible) return null;
        const isHovered = hoveredId === target.id;
        const isEarth = target.id === 'earth';

        return (
          <div
            key={target.id}
            style={{
              transform: `translate3d(${target.screenPos.x}px, ${target.screenPos.y}px, 0)`
            }}
            className="absolute -top-3 -left-3 pointer-events-auto transition-transform duration-75"
          >
            {/* The Reticle Dot / Bracket */}
            <div
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectTarget && onSelectTarget(target.id)}
              className="relative w-6 h-6 flex items-center justify-center cursor-pointer group"
            >
              {/* Subtle pulsing beacon */}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isEarth
                    ? 'bg-[#89cff0] shadow-[0_0_8px_#89cff0]'
                    : isHovered
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-white/40 group-hover:bg-white'
                }`}
              />

              {/* Hairline Target Ring */}
              <span
                className={`absolute inset-0 rounded-full border border-dashed transition-all duration-300 ${
                  isHovered
                    ? 'border-[#89cff0] scale-125 opacity-100 rotate-45'
                    : 'border-white/20 scale-90 opacity-40 group-hover:opacity-75'
                }`}
              />
            </div>

            {/* Non-intrusive Sleek Tooltip Label */}
            <div
              className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 pointer-events-none ${
                isHovered
                  ? 'opacity-100 translate-x-0'
                  : isEarth
                  ? 'opacity-65 translate-x-0'
                  : 'opacity-0 -translate-x-1'
              }`}
            >
              <div className="flex items-center gap-1.5 bg-[#070c18]/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-md shadow-lg">
                <span className="font-mono text-[9px] font-bold text-white tracking-wider">
                  {target.name}
                </span>
                <span className="font-mono text-[8px] text-[#89cff0]">
                  {target.distance}
                </span>
                {isHovered && (
                  <span className="font-mono text-[8px] text-slate-400 border-l border-white/10 pl-1.5">
                    {target.tagline}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
