import React, { useState, useEffect } from 'react';
import { CelestialBodyTarget } from './CosmicCanvas';
import { Sparkles, Activity, Radio } from 'lucide-react';

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

  // Live Jittering Telemetry Numbers (Simulates Real-time Radio Ranging & Doppler Shift)
  const [jitterOffset, setJitterOffset] = useState<number>(382);
  const [earthStatusIndex, setEarthStatusIndex] = useState<number>(0);

  const earthStatuses = [
    '0.12 PIXEL',
    'PALE BLUE DOT',
    'OUR HOME',
    'LIFE: 100%',
    'ORIGIN'
  ];

  // Fast 80ms interval for realistic astrometric telemetry jitter
  useEffect(() => {
    const jitterInterval = setInterval(() => {
      // Random fluctuation around ±45 meters/sub-kilometer
      setJitterOffset((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * 60);
        return Math.max(100, Math.min(999, prev + delta));
      });
    }, 80);

    // Cycle Earth status badge every 2.5 seconds
    const statusInterval = setInterval(() => {
      setEarthStatusIndex((prev) => (prev + 1) % earthStatuses.length);
    }, 2500);

    return () => {
      clearInterval(jitterInterval);
      clearInterval(statusInterval);
    };
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
            {/* The Reticle Dot / Beacon */}
            <div
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectTarget(target.id)}
              className="relative w-8 h-8 flex items-center justify-center cursor-pointer group"
            >
              {/* Earth Radar Ping Waves (Calling out into deep space) */}
              {isEarth && (
                <>
                  <span className="absolute -inset-1 rounded-full border border-[#89cff0]/60 animate-ping pointer-events-none duration-1000" />
                  <span className="absolute -inset-2.5 rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Core Beacon Dot */}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isEarth || isSelected
                    ? 'bg-[#89cff0] shadow-[0_0_12px_#89cff0] scale-110'
                    : isHovered
                    ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                    : 'bg-white/40 group-hover:bg-white'
                }`}
              />

              {/* Rotating Dashed Reticle Ring */}
              <span
                className={`absolute inset-0 rounded-full border border-dashed transition-all duration-500 ${
                  isEarth
                    ? 'border-[#89cff0] scale-125 opacity-90 animate-[spin_8s_linear_infinite]'
                    : isSelected
                    ? 'border-[#89cff0] scale-125 opacity-100 rotate-90 ring-1 ring-cyan-400/40'
                    : isHovered
                    ? 'border-[#89cff0] scale-125 opacity-100 rotate-45'
                    : 'border-white/20 scale-90 opacity-40 group-hover:opacity-75'
                }`}
              />
            </div>

            {/* Interactive Dynamic Tooltip & Live Telemetry Readout */}
            <div
              onClick={() => onSelectTarget(target.id)}
              onMouseEnter={() => setHoveredId(target.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 cursor-pointer pointer-events-auto ${
                isHovered || isSelected || isEarth
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-1 pointer-events-none'
              }`}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md border transition-all ${
                  isEarth
                    ? 'bg-[#060c18]/90 border-cyan-400/50 text-white ring-1 ring-cyan-400/30 hover:border-cyan-300 hover:shadow-cyan-500/20'
                    : isSelected
                    ? 'bg-[#0b1426]/90 border-cyan-400 text-white ring-1 ring-cyan-400/50'
                    : isHovered
                    ? 'bg-[#070e1c]/90 border-cyan-400/60 text-white'
                    : 'bg-[#050914]/75 border-white/15 text-slate-300'
                }`}
              >
                {/* Body Name with animated holographic shimmer */}
                {isEarth ? (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
                    </span>

                    <span className="font-display font-bold text-xs tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#89cff0] to-white animate-pulse drop-shadow-[0_0_8px_rgba(137,207,240,0.8)]">
                      EARTH
                    </span>

                    {/* Smooth Cycling Badge */}
                    <span className="font-mono text-[8px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 tracking-wider transition-all duration-300">
                      {earthStatuses[earthStatusIndex]}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-[9px] font-bold tracking-wider">
                    {target.name}
                  </span>
                )}

                {/* DYNAMIC JITTERING NUMBERS / TELEMETRY */}
                {isEarth ? (
                  <div className="flex items-center gap-1 border-l border-white/15 pl-2 font-mono text-[9px] text-[#89cff0]">
                    <Activity className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                    <span>6,054,558,</span>
                    <span className="font-bold text-white tabular-nums tracking-widest bg-cyan-950/40 px-0.5 rounded">
                      {jitterOffset}
                    </span>
                    <span className="text-[8px] text-slate-400">km</span>
                  </div>
                ) : (
                  <span className="font-mono text-[8px] text-[#89cff0]">
                    {target.distance}
                  </span>
                )}

                {/* Hover Action Hint */}
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
