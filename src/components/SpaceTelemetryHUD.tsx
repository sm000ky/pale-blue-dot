import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  Compass,
  Disc,
  Layers,
  BookOpen,
  Eye,
  Radio
} from 'lucide-react';
import { ViewMode } from './CosmicCanvas';
import { SubtitleCue } from '../data/subtitles';

interface SpaceTelemetryHUDProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  viewMode: ViewMode;
  currentCue: SubtitleCue | null;
  language: 'id' | 'en' | 'ja';
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (val: number) => void;
  onSelectViewMode: (mode: ViewMode) => void;
  onSelectLanguage: (lang: 'id' | 'en' | 'ja') => void;
  onOpenVault: () => void;
}

export const SpaceTelemetryHUD: React.FC<SpaceTelemetryHUDProps> = ({
  currentTime,
  duration,
  isPlaying,
  isMuted,
  volume,
  viewMode,
  currentCue,
  language,
  onTogglePlay,
  onSeek,
  onToggleMute,
  onVolumeChange,
  onSelectViewMode,
  onSelectLanguage,
  onOpenVault
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentDistanceKm = currentCue?.distanceKm ?? Math.max(12000, 6060000000 * (1 - currentTime / 270));
  const formatDistance = (km: number) => {
    if (km >= 1000000000) {
      return `~${(km / 1000000000).toFixed(2)} billion km`;
    }
    if (km >= 1000000) {
      return `~${(km / 1000000).toFixed(1)} million km`;
    }
    return `${Math.round(km).toLocaleString()} km`;
  };

  const lightSeconds = currentDistanceKm / 299792;
  const lightHours = Math.floor(lightSeconds / 3600);
  const lightMinutes = Math.floor((lightSeconds % 3600) / 60);
  const lightSecs = Math.floor(lightSeconds % 60);
  const lightTimeDelay = `${lightHours}h ${lightMinutes.toString().padStart(2, '0')}m ${lightSecs.toString().padStart(2, '0')}s`;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-7 z-20 select-none">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Top Left: Mysterious Brand & Mission Code */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#89cff0]/40 bg-[#070e1c]/80 flex items-center justify-center text-[#89cff0] shadow-lg shadow-cyan-500/10">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm md:text-base tracking-[0.25em] text-white">
                M O T E
              </span>
              <span className="font-mono text-[9px] text-[#89cff0] tracking-widest hidden sm:inline">
                一粒の塵 // 40.5 AU
              </span>
            </div>
            <div className="font-mono text-[9px] text-slate-400 tracking-wider">
              14 FEB 1990 • CARL SAGAN • VOYAGER 1
            </div>
          </div>
        </div>

        {/* Top Right: Astrometric Telemetry */}
        <div className="text-right font-mono text-[10px] md:text-xs">
          <div className="text-slate-500 uppercase tracking-[0.2em] text-[9px]">
            Distance from Earth
          </div>
          <div className="text-[#89cff0] font-bold text-sm md:text-base tracking-wider drop-shadow">
            {formatDistance(currentDistanceKm)}
          </div>
          <div className="flex items-center justify-end gap-2 text-[9px] text-slate-400 mt-1">
            <span>VEL: <strong className="text-slate-200">17.0 km/s</strong></span>
            <span className="text-slate-600">|</span>
            <span>DELAY: <strong className="text-slate-200">{lightTimeDelay}</strong></span>
          </div>
        </div>
      </div>

      {/* Center: Poetic Kinetic Subtitles */}
      <div className="my-auto max-w-3xl mx-auto text-center px-4 transition-all duration-500">
        {currentCue && (
          <div className="space-y-2.5 animate-fadeIn">
            <p className="font-serif text-lg md:text-2xl lg:text-3xl font-light leading-relaxed text-[#f3f4f6] drop-shadow-lg tracking-wide">
              &ldquo;{currentCue.en}&rdquo;
            </p>

            {language === 'id' && (
              <p className="font-serif italic text-sm md:text-lg text-[#89cff0] leading-relaxed max-w-2xl mx-auto drop-shadow">
                {currentCue.id_lang}
              </p>
            )}
            {language === 'ja' && (
              <p className="font-serif text-sm md:text-base text-[#89cff0] leading-relaxed max-w-2xl mx-auto drop-shadow">
                {currentCue.ja}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: Timeline & Controls */}
      <div className="pointer-events-auto flex flex-col gap-2.5">
        {/* Subtle Timeline Scrubber */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              onSeek(pos * duration);
            }}
            className="flex-1 h-1.5 bg-[#0e1422] border border-[#1b253b] rounded-full cursor-pointer relative overflow-hidden group"
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-sky-400 to-[#89cff0] transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* Tactical Control Console */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070b14]/85 backdrop-blur-md border border-white/10 px-3.5 py-2.5 rounded-2xl shadow-2xl">
          {/* Play/Pause & Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-4 py-2 rounded-xl font-display uppercase tracking-widest text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500/90 text-black font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-[#89cff0] text-black font-bold shadow-lg shadow-cyan-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'TRANSMIT'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-[#0c1220] border border-white/10 px-2.5 py-1.5 rounded-xl">
              <button
                onClick={onToggleMute}
                className="text-slate-400 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : Math.round(volume * 100)}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                className="w-16 md:w-20 h-1 bg-[#1a2336] rounded-lg appearance-none cursor-pointer accent-[#89cff0]"
              />
            </div>
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-1 p-0.5 bg-[#0c1220] border border-white/10 rounded-xl">
            {(
              [
                { id: 'cinema', label: 'Cinema', icon: Eye },
                { id: 'free', label: 'Orbit 360°', icon: Compass },
                { id: 'record', label: 'Golden Record', icon: Disc }
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSelectViewMode(id)}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                  viewMode === id
                    ? 'bg-[#1a253c] text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3 text-[#89cff0]" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Languages & Vault */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 p-0.5 bg-[#0c1220] border border-white/10 rounded-xl">
              <Globe className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5" />
              {(
                [
                  { id: 'id', label: 'ID' },
                  { id: 'en', label: 'EN' },
                  { id: 'ja', label: 'JA' }
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onSelectLanguage(id)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-all ${
                    language === id
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenVault}
              className="px-3 py-1.5 rounded-xl bg-[#141b2c] hover:bg-[#1d273e] border border-[#27354f] text-[#f3c66f] font-mono text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Archive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
