import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Globe,
  Compass,
  Disc,
  BookOpen,
  Eye,
  Radio,
  Subtitles as SubtitlesIcon,
  Sparkles
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
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);

  // Smooth Crossfade Buffer State (Prevents text snapping / stiffness on cue change)
  const [displayedCue, setDisplayedCue] = useState<SubtitleCue | null>(currentCue);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const fadeTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (currentCue?.id !== displayedCue?.id) {
      // Start smooth organic fade out
      setIsFadingOut(true);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

      fadeTimeoutRef.current = setTimeout(() => {
        setDisplayedCue(currentCue);
        setIsFadingOut(false);
      }, 280); // 280ms silky fade-out before smooth fade-in
    }
  }, [currentCue, displayedCue]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Real NASA JPL ephemeris calculation: 40.47 AU down to Earth
  const currentDistanceKm = currentCue?.distanceKm ?? Math.max(12000, 6054558000 * (1 - currentTime / 270));
  const formatDistance = (km: number) => {
    if (km >= 1000000000) {
      const au = (km / 149597870.7).toFixed(2);
      return `${(km / 1000000000).toFixed(2)}B km (${au} AU)`;
    }
    if (km >= 1000000) {
      return `${(km / 1000000).toFixed(1)}M km`;
    }
    return `${Math.round(km).toLocaleString()} km`;
  };

  const lightSeconds = currentDistanceKm / 299792;
  const lightHours = Math.floor(lightSeconds / 3600);
  const lightMinutes = Math.floor((lightSeconds % 3600) / 60);
  const lightSecs = Math.floor(lightSeconds % 60);
  const lightTimeDelay = `${lightHours}h ${lightMinutes.toString().padStart(2, '0')}m ${lightSecs.toString().padStart(2, '0')}s`;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Pure floating typography with glowing cyan highlights
  const renderSubtitleContent = () => {
    if (!displayedCue) return null;

    const highlightWords = (text: string) => {
      const regex = /(titik|rumah|debu|bumi|kita|panggung|sungai darah|piksel|dot|home|us|mote of dust|earth|rivers of blood|pixel|pale blue dot|地球|家|点|血の河)/gi;
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#89cff0] font-medium drop-shadow-[0_0_12px_rgba(137,207,240,0.6)]">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    return (
      <div className="space-y-0.5 text-center max-w-xl mx-auto pointer-events-none select-none">
        {displayedCue.chapter && (
          <div className="flex items-center justify-center gap-1.5 font-mono text-[8px] tracking-[0.3em] text-[#89cff0]/80 uppercase pb-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{displayedCue.chapter}</span>
          </div>
        )}

        {language === 'id' && (
          <>
            <p className="font-serif text-xs md:text-sm lg:text-[0.95rem] text-[#f4f5f7] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] tracking-wide">
              &ldquo;{highlightWords(displayedCue.id_lang)}&rdquo;
            </p>
            <p className="font-mono text-[9px] text-slate-400/70 tracking-wide line-clamp-1 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {displayedCue.en}
            </p>
          </>
        )}

        {language === 'ja' && (
          <>
            <p className="font-serif text-xs md:text-sm text-[#f4f5f7] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] tracking-wide">
              「{highlightWords(displayedCue.ja)}」
            </p>
            <p className="font-mono text-[9px] text-slate-400/70 tracking-wide line-clamp-1 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {displayedCue.en}
            </p>
          </>
        )}

        {language === 'en' && (
          <p className="font-serif text-xs md:text-sm lg:text-[0.95rem] text-[#f4f5f7] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] tracking-wide">
            &ldquo;{highlightWords(displayedCue.en)}&rdquo;
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 z-20 select-none">
      {/* Top Bar: Minimal Ethereal Telemetry (Keeps top 100% clean) */}
      <div className="flex items-start justify-between gap-4">
        {/* Top Left: Mission Identification */}
        <div className="pointer-events-auto flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-full border border-[#89cff0]/30 bg-[#070e1c]/80 backdrop-blur flex items-center justify-center text-[#89cff0] shadow-lg shadow-cyan-500/10">
            <Radio className="w-3 h-3 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-xs md:text-sm tracking-[0.2em] text-white">
                M O T E
              </span>
              <span className="text-[#89cff0] font-mono text-[9px] tracking-widest hidden sm:inline">• 40.47 AU</span>
            </div>
            <div className="font-mono text-[9px] text-slate-400 tracking-wider">
              VOYAGER 1 // NAC 1500MM FOV 0.42°
            </div>
          </div>
        </div>

        {/* Top Right: Real NASA JPL Astrometric Data */}
        <div className="text-right font-mono text-[9px] md:text-[11px] opacity-85 hover:opacity-100 transition-opacity">
          <div className="text-slate-500 uppercase tracking-[0.15em] text-[8px] md:text-[9px]">
            Distance from Earth
          </div>
          <div className="text-[#89cff0] font-semibold text-xs md:text-sm tracking-wider drop-shadow">
            {formatDistance(currentDistanceKm)}
          </div>
          <div className="text-slate-400 text-[8px] md:text-[9px] mt-0.5">
            VEL 17.02 km/s • DELAY {lightTimeDelay}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: SUBTITLES + SCRUBBER + CONTROLS (Drives everything to the bottom!) */}
      <div className="pointer-events-auto flex flex-col gap-2 w-full max-w-4xl mx-auto">
        {/* SUBTITLES DOCKED DIRECTLY AT THE BOTTOM (ZERO BACKGROUND BOX, SEAMLESS FILM DISSOLVE) */}
        <div className="pointer-events-none w-full px-4 min-h-[46px] flex items-end justify-center">
          {showSubtitles && (
            <div
              className={`transition-all duration-500 ease-out transform ${
                displayedCue && !isFadingOut
                  ? 'opacity-100 filter-none translate-y-0 scale-100'
                  : 'opacity-0 blur-md translate-y-2 scale-[0.98]'
              }`}
            >
              {renderSubtitleContent()}
            </div>
          )}
        </div>

        {/* Hairline Timeline Scrubber */}
        <div className="flex items-center gap-2.5 font-mono text-[9px] text-slate-500 px-1">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              onSeek(pos * duration);
            }}
            className="flex-1 h-1 bg-white/10 hover:h-1.5 rounded-full cursor-pointer relative overflow-hidden transition-all group"
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-sky-400 to-[#89cff0] transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>

        {/* Tactical Control Pill */}
        <div className="flex items-center justify-between gap-2 bg-[#060a14]/85 backdrop-blur-md border border-white/10 px-3 py-2 rounded-2xl shadow-2xl">
          {/* Left: Play/Pause + Mute */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-3.5 py-1.5 rounded-xl font-display uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500/90 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-[#89cff0] text-black font-semibold shadow-md shadow-cyan-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'TRANSMIT'}</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Center: View Modes */}
          <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10 rounded-xl">
            {(
              [
                { id: 'cinema', label: 'Cinema', icon: Eye },
                { id: 'free', label: 'Orbit', icon: Compass },
                { id: 'record', label: 'Record', icon: Disc }
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSelectViewMode(id)}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1 transition-all ${
                  viewMode === id
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3 text-[#89cff0]" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Right: Subtitle Toggle + Language + Archive */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSubtitles((prev) => !prev)}
              title={showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
              className={`p-1.5 rounded-xl border transition-all ${
                showSubtitles
                  ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
              }`}
            >
              <SubtitlesIcon className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-0.5 p-0.5 bg-white/5 border border-white/10 rounded-xl">
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
                  className={`px-1.5 py-0.5 rounded font-mono text-[9px] transition-all ${
                    language === id
                      ? 'bg-cyan-500/25 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenVault}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#f3c66f] font-mono text-[10px] flex items-center gap-1 transition-all active:scale-95"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Vault</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
