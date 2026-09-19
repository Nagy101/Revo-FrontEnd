'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Total duration: 3.2s
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 4, filter: 'blur(20px)' }} // Cinematic "Zoom into the screen" exit
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          <div className="flex items-center gap-6 md:gap-10">
            {/* Giant Glowing Play Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
              className="flex items-center justify-center w-24 h-24 md:w-40 md:h-40 rounded-3xl md:rounded-[3rem] bg-[#C3143D] text-white relative z-10"
              style={{ boxShadow: '0 0 80px rgba(195,20,61,0.6)' }}
            >
              <Play fill="currentColor" className="w-12 h-12 md:w-20 md:h-20 ml-3 md:ml-4" />
            </motion.div>

            {/* Huge Bold Text */}
            <div className="flex flex-col justify-center overflow-hidden">
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.8 }}
                className="text-8xl md:text-[12rem] font-black text-white leading-none tracking-tighter"
                style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
              >
                REVO
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                className="text-[#C3143D] text-xl md:text-4xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2 md:mt-4 ml-1 md:ml-3"
              >
                Media Production
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
