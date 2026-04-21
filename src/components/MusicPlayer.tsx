import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "NEURAL_DRIFT.mp3",
    artist: "GEN_ALPHA_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan"
  },
  {
    id: 2,
    title: "CYBER_RESONANCE.wav",
    artist: "VOID_ENGINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-magenta"
  },
  {
    id: 3,
    title: "BIT_CRUSH_DREAMS.flac",
    artist: "DATA_GHOST",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-yellow"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex = currentTrackIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    setProgress(0);
    // Audio source update is handled by useEffect
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-void-black/60 border-l-2 border-neon-magenta/30 p-6 backdrop-blur-xl relative overflow-hidden">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => skipTrack('next')}
      />
      
      {/* Background visualizer aesthetic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="flex items-end justify-between h-full w-full gap-1 p-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-full bg-neon-magenta"
              animate={{ height: isPlaying ? [10, Math.random() * 80 + 20, 10] : 10 }}
              transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 bg-neon-magenta/20 flex items-center justify-center border border-neon-magenta group hover:border-white transition-colors cursor-crosshair overflow-hidden">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <Music className="text-neon-magenta w-8 h-8" />
            </motion.div>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.h3 
                key={currentTrack.title}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-xl font-glitch text-neon-cyan leading-tight mb-1"
              >
                {currentTrack.title}
              </motion.h3>
            </AnimatePresence>
            <p className="text-xs font-mono text-neon-magenta/80 tracking-[0.2em]">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-1 bg-white/10 w-full relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-neon-cyan shadow-[0_0_8px_#00ffff]" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono mt-2 text-white/40">
            <span>{audioRef.current ? Math.floor(audioRef.current.currentTime) : 0}s</span>
            <span>{audioRef.current ? Math.floor(audioRef.current.duration) || 0 : 0}s</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => skipTrack('prev')}
            className="text-white/60 hover:text-neon-cyan transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full border-2 border-neon-cyan flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
          </button>

          <button 
            onClick={() => skipTrack('next')}
            className="text-white/60 hover:text-neon-cyan transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-neon-cyan" />
            <div className="w-24 h-0.5 bg-white/10 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-2/3 bg-neon-cyan opacity-40" />
            </div>
          </div>
          <span className="text-[10px] font-glitch text-neon-magenta animate-pulse">LIVE_FEED</span>
        </div>
      </div>
    </div>
  );
}
