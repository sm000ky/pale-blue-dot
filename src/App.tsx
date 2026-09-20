import React, { useState, useEffect, useRef } from 'react';
import { CosmicCanvas, ViewMode, PlanetPOI, CelestialBodyTarget } from './components/CosmicCanvas';
import { SpaceTelemetryHUD } from './components/SpaceTelemetryHUD';
import { CelestialTargetPins } from './components/CelestialTargetPins';
import { GoldenRecordVault } from './components/GoldenRecordVault';
import { EnterVoidOverlay } from './components/EnterVoidOverlay';
import { PoiCard } from './components/PoiCard';
import { SUBTITLES, SubtitleCue } from './data/subtitles';

export const App: React.FC = () => {
  // Autoplay & Entrance State
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  // Playback & Timing state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(270.8);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // View, POI, Celestial Targets & Language state
  const [viewMode, setViewMode] = useState<ViewMode>('cinema');
  const [language, setLanguage] = useState<'id' | 'en' | 'ja'>('id');
  const [selectedPoi, setSelectedPoi] = useState<PlanetPOI | null>(null);
  const [celestialTargets, setCelestialTargets] = useState<CelestialBodyTarget[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);

  // Audio elements refs
  const vocalAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  // Current Subtitle Cue
  const currentCue: SubtitleCue | null =
    SUBTITLES.find((c) => currentTime >= c.start && currentTime <= c.end) || null;

  // Handle Entrance & Autoplay
  const handleEnterVoid = () => {
    setHasEntered(true);
    const vocal = vocalAudioRef.current;
    const music = musicAudioRef.current;
    if (vocal && music) {
      vocal.play().catch(() => {});
      music.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Audio Playback & Auto-ducking
  const togglePlay = () => {
    const vocal = vocalAudioRef.current;
    const music = musicAudioRef.current;
    if (!vocal || !music) return;

    if (isPlaying) {
      vocal.pause();
      music.pause();
      setIsPlaying(false);
    } else {
      vocal.play().catch(() => {});
      music.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    const vocal = vocalAudioRef.current;
    const music = musicAudioRef.current;
    if (!vocal || !music) return;

    vocal.currentTime = time;
    music.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (vocalAudioRef.current && musicAudioRef.current) {
      vocalAudioRef.current.volume = val;
      musicAudioRef.current.volume = val * 0.45;
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (vocalAudioRef.current && musicAudioRef.current) {
      vocalAudioRef.current.muted = nextMuted;
      musicAudioRef.current.muted = nextMuted;
    }
  };

  // Sync current time from audio & dynamic ducking
  useEffect(() => {
    const vocal = vocalAudioRef.current;
    const music = musicAudioRef.current;
    if (!vocal || !music) return;

    const handleTimeUpdate = () => {
      setCurrentTime(vocal.currentTime);

      const isSpeaking = SUBTITLES.some(
        (c) => vocal.currentTime >= c.start && vocal.currentTime <= c.end
      );
      if (!isMuted) {
        const targetMusicVol = isSpeaking ? volume * 0.28 : volume * 0.65;
        music.volume = targetMusicVol;
      }
    };

    const handleLoadedMetadata = () => {
      if (vocal.duration) {
        setDuration(vocal.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    vocal.addEventListener('timeupdate', handleTimeUpdate);
    vocal.addEventListener('loadedmetadata', handleLoadedMetadata);
    vocal.addEventListener('ended', handleEnded);

    return () => {
      vocal.removeEventListener('timeupdate', handleTimeUpdate);
      vocal.removeEventListener('loadedmetadata', handleLoadedMetadata);
      vocal.removeEventListener('ended', handleEnded);
    };
  }, [isMuted, volume]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (!hasEntered) {
          handleEnterVoid();
        } else {
          togglePlay();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if (e.key === '1') {
        setViewMode('cinema');
      } else if (e.key === '2') {
        setViewMode('free');
      } else if (e.key === '3') {
        setViewMode('record');
      } else if (e.key === 'v' || e.key === 'V') {
        setIsVaultOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsVaultOpen(false);
        setSelectedPoi(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, isPlaying, isMuted]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#020408] text-white select-none">
      {/* Background Audio Elements */}
      <audio
        ref={vocalAudioRef}
        src="/audio/sagan-vocals.mp3"
        preload="auto"
      />
      <audio
        ref={musicAudioRef}
        src="/audio/aurora.mp3"
        preload="auto"
        loop
      />

      {/* 3D WebGL Cosmic Canvas */}
      <CosmicCanvas
        currentTime={currentTime}
        duration={duration}
        viewMode={viewMode}
        isPlaying={isPlaying}
        selectedPoi={selectedPoi}
        onSelectPoi={setSelectedPoi}
        onUpdateTargets={setCelestialTargets}
      />

      {/* Subtle Interactive Celestial Target Reticles (Earth, Moon, Sun, Mars, Jupiter) */}
      <CelestialTargetPins targets={celestialTargets} />

      {/* Space Telemetry HUD Overlay */}
      <SpaceTelemetryHUD
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        viewMode={viewMode}
        currentCue={currentCue}
        language={language}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onSelectViewMode={setViewMode}
        onSelectLanguage={setLanguage}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Selected Earth POI Card */}
      {selectedPoi && (
        <PoiCard
          poi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
        />
      )}

      {/* NASA Golden Record Vault Modal */}
      {isVaultOpen && (
        <GoldenRecordVault onClose={() => setIsVaultOpen(false)} />
      )}

      {/* Cinematic Mysterious Entrance Overlay (Autoplay Gate) */}
      {!hasEntered && (
        <EnterVoidOverlay onEnter={handleEnterVoid} />
      )}
    </div>
  );
};

export default App;
