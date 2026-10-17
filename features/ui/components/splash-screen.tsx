'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Sparkles, Film } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // Progress bar animation: 0% to 100% over 3.8s
    const startTime = Date.now();
    const duration = 3800;

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

  const handleExit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsVisible(false);
    document.body.style.overflow = 'auto';
    setTimeout(onComplete, 700);
  };

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1;
      setIsMuted(nextMuted);
    }
  };

  const handleContainerClick = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      setIsMuted(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleContainerClick}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#050505] overflow-hidden select-none cursor-pointer"
        >
          {/* ── CINEMATIC FULL-SCREEN VIDEO BACKGROUND ── */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
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

            {/* Audio Toggle */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onClick={toggleSound}
              type="button"
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                isMuted 
                  ? "bg-[#C3143D]/25 hover:bg-[#C3143D]/40 border-[#C3143D]/60 text-white animate-pulse" 
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-200"
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#C3143D]" />
                  <span className="text-[11px] font-semibold tracking-wide">تشغيل الصوت • Unmute</span>
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
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3 
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
              transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
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
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-[11px] sm:text-xs text-white/50 tracking-[0.25em] uppercase font-light"
            >
              Concerts • Mega Stadium Scale • Commercial Cinema
            </motion.p>

            {/* Sound Prompt Hint */}
            {isMuted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70 tracking-wider backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D] animate-ping" />
                <span>انقر في أي مكان لتشغيل الصوت • Tap anywhere for sound</span>
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
                className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.08] hover:bg-[#C3143D] border border-white/15 hover:border-[#C3143D] text-xs font-semibold text-white tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(195,20,61,0.5)] active:scale-95"
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
