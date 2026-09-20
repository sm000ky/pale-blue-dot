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
  Eye
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
  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format distance
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

  // Light travel delay: distance / speed of light (299,792 km/s)
  const lightSeconds = currentDistanceKm / 299792;
  const lightHours = Math.floor(lightSeconds / 3600);
  const lightMinutes = Math.floor((lightSeconds % 3600) / 60);
  const lightSecs = Math.floor(lightSeconds % 60);
  const lightTimeDelay = `${lightHours}h ${lightMinutes.toString().padStart(2, '0')}m ${lightSecs.toString().padStart(2, '0')}s`;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-20 select-none">
      {/* Top HUD Bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Top Left: Voyager Mission Telemetry */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#89cff0]/20 border border-[#89cff0]/40 flex items-center justify-center text-[#89cff0] font-mono font-bold text-xs shadow-lg shadow-cyan-500/15">
            V1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm md:text-base tracking-widest text-white">
                PALE BLUE DOT
              </h1>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 uppercase tracking-widest">
                VOYAGER 1
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
              14 FEB 1990 • 40.5 AU • CARL SAGAN MONOLOGUE
            </div>
          </div>
        </div>

        {/* Top Right: Real-time Astrometric Telemetry */}
        <div className="text-right font-mono text-[10px] md:text-xs">
          <div className="text-slate-400 uppercase tracking-widest text-[9px]">
            Distance from Earth
          </div>
          <div className="text-white font-bold text-sm md:text-base text-[#89cff0] tracking-wider">
            {formatDistance(currentDistanceKm)}
          </div>
          <div className="flex items-center justify-end gap-2 text-[9px] text-slate-400 mt-1">
            <span>VELOCITY: <strong className="text-slate-200">17.0 km/s</strong></span>
            <span className="text-slate-600">|</span>
            <span>LIGHT DELAY: <strong className="text-slate-200">{lightTimeDelay}</strong></span>
          </div>
        </div>
      </div>

      {/* Center Screen: Kinetic Editorial Subtitles */}
      <div className="my-auto max-w-3xl mx-auto text-center px-4 transition-all duration-500">
        {currentCue && (
          <div className="space-y-2 animate-fadeIn">
            {/* Primary Spoken English */}
            <p className="font-serif text-lg md:text-2xl lg:text-3xl font-light leading-relaxed text-[#f3f4f6] drop-shadow-md tracking-wide">
              &ldquo;{currentCue.en}&rdquo;
            </p>

            {/* Translated Subtitle */}
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

      {/* Bottom Controls Bar */}
      <div className="pointer-events-auto flex flex-col gap-3">
        {/* Timeline Scrubber */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              onSeek(pos * duration);
            }}
            className="flex-1 h-2 bg-[#121826] border border-[#1f283d] rounded-full cursor-pointer relative overflow-hidden group"
          >
            {/* Progress bar */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-[#89cff0] transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0d16]/90 backdrop-blur border border-[#1f283d] px-3.5 py-2.5 rounded-2xl shadow-2xl">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-4 py-2 rounded-xl font-display uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-[#89cff0] text-black font-bold shadow-lg shadow-cyan-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY TRANSMISSION'}</span>
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 bg-[#111726] border border-[#1d263b] px-2.5 py-1.5 rounded-xl">
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
                className="w-16 md:w-20 h-1 bg-[#1c2438] rounded-lg appearance-none cursor-pointer accent-[#89cff0]"
              />
            </div>
          </div>

          {/* Center: View Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-[#111726] border border-[#1d263b] rounded-xl">
            {(
              [
                { id: 'cinema', label: 'Cinema Voyage', icon: Eye },
                { id: 'free', label: 'Free Orbit', icon: Compass },
                { id: 'record', label: 'Golden Record', icon: Disc }
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSelectViewMode(id)}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                  viewMode === id
                    ? 'bg-[#1e273e] text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3 text-[#89cff0]" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Right: Subtitle Language & Golden Record Vault */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-0.5 p-0.5 bg-[#111726] border border-[#1d263b] rounded-xl">
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

            {/* Golden Record Vault Button */}
            <button
              onClick={onOpenVault}
              className="px-3 py-1.5 rounded-xl bg-[#182033] hover:bg-[#222d48] border border-[#263450] text-[#f3c66f] font-mono text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NASA Archive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
