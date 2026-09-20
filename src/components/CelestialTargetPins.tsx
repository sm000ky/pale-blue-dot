import React, { useState } from 'react';
import { CelestialBodyTarget } from './CosmicCanvas';
import { Sparkles, Compass } from 'lucide-react';

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
            {/* The Reticle Dot / Bracket */}
            <div
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectTarget(target.id)}
              className="relative w-7 h-7 flex items-center justify-center cursor-pointer group"
            >
              {/* Subtle pulsing beacon */}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isEarth || isSelected
                    ? 'bg-[#89cff0] shadow-[0_0_10px_#89cff0]'
                    : isHovered
                    ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                    : 'bg-white/40 group-hover:bg-white'
                }`}
              />

              {/* Hairline Target Ring */}
              <span
                className={`absolute inset-0 rounded-full border border-dashed transition-all duration-300 ${
                  isSelected
                    ? 'border-[#89cff0] scale-125 opacity-100 rotate-90 ring-1 ring-cyan-400/40'
                    : isHovered
                    ? 'border-[#89cff0] scale-125 opacity-100 rotate-45'
                    : 'border-white/20 scale-90 opacity-40 group-hover:opacity-75'
                }`}
              />
            </div>

            {/* Interactive Tooltip & Click-to-Inspect Chip */}
            <div
              onClick={() => onSelectTarget(target.id)}
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 cursor-pointer pointer-events-auto ${
                isHovered || isSelected
                  ? 'opacity-100 translate-x-0'
                  : isEarth
                  ? 'opacity-75 translate-x-0'
                  : 'opacity-0 -translate-x-1'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md border transition-all ${
                  isSelected
                    ? 'bg-[#0b1426]/90 border-cyan-400 text-white ring-1 ring-cyan-400/50'
                    : isHovered
                    ? 'bg-[#070e1c]/90 border-cyan-400/60 text-white'
                    : 'bg-[#050914]/75 border-white/15 text-slate-300 hover:border-white/30'
                }`}
              >
                <span className="font-mono text-[9px] font-bold tracking-wider">
                  {target.name}
                </span>
                <span className="font-mono text-[8px] text-[#89cff0]">
                  {target.distance}
                </span>

                {isHovered && (
                  <span className="font-mono text-[8px] text-cyan-300 border-l border-white/10 pl-1.5 flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> Inspect
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
