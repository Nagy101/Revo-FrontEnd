'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Sparkles, Film, Play } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasExitedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      // Strictly enforce muted properties for mobile autoplay policy compliance
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('autoplay', '');

      const handlePlaying = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('playing', handlePlaying);
      video.addEventListener('play', handlePlaying);
      video.addEventListener('pause', handlePause);

      const tryPlay = () => {
        if (!video) return;
        video.muted = true;
        const p = video.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true)).catch(() => {
            // Autoplay blocked by mobile battery/power saver policy
            setIsPlaying(false);
          });
        }
      };

      tryPlay();
      video.addEventListener('loadedmetadata', tryPlay, { once: true });
      video.addEventListener('canplay', tryPlay, { once: true });

      // First touch/tap anywhere on the window starts silent playback if blocked
      const handleFirstTouch = () => {
        if (video && video.paused) {
          video.muted = true;
          video.play().catch(() => {});
        }
      };
      window.addEventListener('touchstart', handleFirstTouch, { once: true, passive: true });
      window.addEventListener('pointerdown', handleFirstTouch, { once: true, passive: true });

      return () => {
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('play', handlePlaying);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('loadedmetadata', tryPlay);
        video.removeEventListener('canplay', tryPlay);
        window.removeEventListener('touchstart', handleFirstTouch);
        window.removeEventListener('pointerdown', handleFirstTouch);
      };
    }
  }, []);

  useEffect(() => {
    // Smooth progress bar: 0% to 100% over 5s
    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleExit();
      }
    }, 40);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleExit = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    setIsVisible(false);
    document.body.style.overflow = 'auto';
    setTimeout(onComplete, 600);
  };

  const toggleSound = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
      }
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      video.volume = 1;
      setIsMuted(nextMuted);
    }
  };

  const handleContainerTap = (e: React.SyntheticEvent) => {
    // If the video is paused, tap starts playback SILENTLY (does NOT force unmute)
    const video = videoRef.current;
    if (video && video.paused) {
      video.muted = isMuted;
      video.play().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleContainerTap}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#050505] overflow-hidden select-none cursor-pointer touch-manipulation"
        >
          {/* ── CINEMATIC FULL-SCREEN VIDEO BACKGROUND ── */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              src="/videos/revo-disco-misr.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/revo-hero-bg.jpg"
              className="w-full h-full object-cover scale-105"
            >
              <source src="/videos/revo-disco-misr.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Multilayer Vignette & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />
            
            {/* Ambient Crimson Center Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C3143D]/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Film Grain Texture */}
            <div 
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{ backgroundImage: 'url("/images/noise.png")' }} 
            />
          </div>

          {/* ── TOP BAR: BRAND STATUS & SOUND TOGGLE ── */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#C3143D] animate-ping" />
              <Film className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/80">
                REVO Cinematic Premiere
              </span>
            </motion.div>

            {/* Audio Toggle (Controls sound independently without locking video) */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onClick={toggleSound}
              type="button"
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 ${
                isMuted 
                  ? "bg-black/60 hover:bg-[#C3143D]/20 border-white/20 text-white/80 hover:text-white" 
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-200"
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-white/60 group-hover:text-[#C3143D]" />
                  <span className="text-[11px] font-semibold tracking-wide">صوت العرض • Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-semibold tracking-wide text-emerald-300">Sound Playing</span>
                </>
              )}
            </motion.button>
          </div>

          {/* ── CENTER: THE OFFICIAL REVO LOGO REVEAL ── */}
          <div className="relative z-10 my-auto text-center px-6 flex flex-col items-center">
            
            {/* Glowing Logo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.1, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.25 
              }}
              className="relative inline-block mb-6 group"
            >
              {/* Backlight Glow Behind Logo */}
              <div className="absolute inset-0 -inset-x-8 bg-[#C3143D]/30 blur-3xl rounded-full scale-110 pointer-events-none" />

              <img
                src="/images/revo-logo.png"
                alt="REVO Media Production"
                className="relative h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-[0_15px_40px_rgba(195,20,61,0.55)]"
              />
            </motion.div>

            {/* Tagline Animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3 sm:gap-4 mb-3"
            >
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C3143D]" />
              <span className="text-xs sm:text-sm md:text-base font-sora font-semibold tracking-[0.35em] sm:tracking-[0.45em] uppercase text-white/90">
                Creative Media Production
              </span>
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
            </motion.div>

            {/* Micro Details */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-[11px] sm:text-xs text-white/50 tracking-[0.25em] uppercase font-light"
            >
              Concerts • Mega Stadium Scale • Commercial Cinema
            </motion.p>

            {/* Play prompt shown ONLY if mobile browser policy paused the video */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C3143D]/30 border border-[#C3143D]/60 text-xs text-white tracking-wider backdrop-blur-md animate-pulse shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>انقر في أي مكان لتشغيل الفيديو • Tap to play</span>
              </motion.div>
            )}
          </div>

          {/* ── BOTTOM BAR: PROGRESS & SKIP BUTTON ── */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-6 sm:pb-8">
            <div className="flex items-center justify-between gap-4 mb-3">
              {/* Status & Counter */}
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" />
                <span className="hidden sm:inline">Initializing Experience</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>

              {/* Skip / Enter Action */}
              <button
                type="button"
                onClick={handleExit}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-[#C3143D] border border-white/15 hover:border-[#C3143D] text-xs font-semibold text-white tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(195,20,61,0.5)] active:scale-95"
              >
                <span>Enter Website</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Sleek Progress Line */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C3143D] via-red-500 to-[#F04F6A] shadow-[0_0_12px_rgba(195,20,61,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
