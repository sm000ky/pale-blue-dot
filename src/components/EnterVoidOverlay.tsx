import React from 'react';
import { Sparkles, Radio } from 'lucide-react';

interface EnterVoidOverlayProps {
  onEnter: () => void;
}

export const EnterVoidOverlay: React.FC<EnterVoidOverlayProps> = ({ onEnter }) => {
  return (
    <div
      onClick={onEnter}
      className="fixed inset-0 z-50 bg-[#020408]/95 backdrop-blur-lg flex flex-col items-center justify-between p-8 select-none cursor-pointer transition-opacity duration-1000"
    >
      {/* Top Telemetry */}
      <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase flex items-center gap-2">
        <Radio className="w-3 h-3 text-[#89cff0] animate-pulse" />
        <span>VOYAGER 1 // INTERSTELLAR FREQUENCY 1420 MHZ</span>
      </div>

      {/* Center Cinematic Title */}
      <div className="max-w-2xl text-center space-y-6 animate-fadeIn">
        <div className="space-y-2">
          <div className="font-mono text-[11px] tracking-[0.4em] text-[#89cff0] uppercase">
            一粒の塵 // 40.5 AU
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-normal tracking-[0.2em] text-white drop-shadow-2xl">
            M O T E
          </h1>
          <p className="font-mono text-xs text-slate-400 tracking-[0.25em] uppercase">
            The Last Reflection from the Cosmic Shore
          </p>
        </div>

        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#89cff0]/40 to-transparent" />

        <p className="font-serif italic text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-lg mx-auto">
          &ldquo;Look again at that dot. That's here. That's home. That's us. On it, everyone you ever heard of lived out their lives.&rdquo;
        </p>

        {/* Ambient Enter Button */}
        <div className="pt-4">
          <button
            onClick={onEnter}
            className="group relative px-8 py-3.5 rounded-full border border-[#89cff0]/40 bg-[#070e1c]/80 hover:bg-[#89cff0]/20 text-[#89cff0] hover:text-white font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>Enter the Void</span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="font-mono text-[9px] text-slate-600 tracking-[0.2em] uppercase">
        Click anywhere to begin audio transmission • Headphones recommended
      </div>
    </div>
  );
};
