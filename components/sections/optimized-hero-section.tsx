"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { ArrowDown, Play, Sparkles } from "lucide-react"

const EASE = [0.16, 1, 0.3, 1] as const

export function OptimizedHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Scroll Parallax Effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -250])

  // Mobile Collage Scroll Effects
  const mobileRotate1 = useTransform(scrollYProgress, [0, 1], [-8, -25])
  const mobileY1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const mobileRotate2 = useTransform(scrollYProgress, [0, 1], [6, 20])
  const mobileY2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const mobileScaleImg = useTransform(scrollYProgress, [0, 1], [1.1, 1.35])

  // Mouse Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mousePixelX = useMotionValue(0)
  const mousePixelY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 150, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 150, mass: 0.5 })
  const smoothPixelX = useSpring(mousePixelX, { damping: 40, stiffness: 150, mass: 0.5 })
  const smoothPixelY = useSpring(mousePixelY, { damping: 40, stiffness: 150, mass: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
      mousePixelX.set(e.clientX)
      mousePixelY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, mousePixelX, mousePixelY])

  // GPU-Accelerated Spotlight Transform
  const spotlightX = useTransform(smoothPixelX, x => x - 800)
  const spotlightY = useTransform(smoothPixelY, y => y - 800)
  
  const imgX1 = useTransform(smoothX, [-1, 1], [-30, 30])
  const imgY1 = useTransform(smoothY, [-1, 1], [-30, 30])
  const imgX2 = useTransform(smoothX, [-1, 1], [40, -40])
  const imgY2 = useTransform(smoothY, [-1, 1], [40, -40])

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[100dvh] h-auto py-24 md:py-0 lg:min-h-[900px] flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── BASE BACKGROUND ── */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0 origin-top will-change-transform"
      >
        <img 
          src="/images/agency_hero_bg.jpg" 
          alt="Revo Agency Background" 
          className="w-full h-full object-cover opacity-[0.35] grayscale-[20%]"
        />
        {/* Gradients for depth (Removed mix-blend for performance) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/70 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-full" />
      </motion.div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div 
          className="fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
          style={{ 
            background: 'radial-gradient(circle, rgba(195, 20, 61, 0.15) 0%, transparent 60%)',
            x: spotlightX,
            y: spotlightY
          }}
        />
      )}

      {/* ── FLOATING PARALLAX IMAGES (DESKTOP) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block max-w-[1600px] mx-auto w-full">
        <motion.div
          style={{ y: floatY1, x: imgX1, rotate: -6 }}
          className="absolute left-[5%] top-[15%] w-64 h-80 rounded-3xl overflow-hidden border border-white/5 shadow-2xl opacity-60 backdrop-blur-sm"
        >
          <img src="/images/auth-bg.jpg" className="w-full h-full object-cover scale-110" alt="Production" />
          <div className="absolute inset-0 bg-[#C3143D]/20 mix-blend-overlay" />
        </motion.div>

        <motion.div
          style={{ y: floatY2, x: imgX2, rotate: 8 }}
          className="absolute right-[5%] bottom-[15%] w-72 h-96 rounded-3xl overflow-hidden border border-[#C3143D]/20 shadow-[0_0_40px_rgba(195,20,61,0.15)] opacity-80"
        >
          <img src="/images/agency_hero_bg.jpg" className="w-full h-full object-cover scale-110" alt="Creative" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-50" />
        </motion.div>
      </div>

      {/* ── NOISE OVERLAY (GPU OPTIMIZED) ── */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/images/noise.png")' }} />

      {/* ── MAIN CONTENT ── */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center mt-10 md:mt-20"
      >
        
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C3143D]" />
          <span className="flex items-center gap-2 text-white text-xs md:text-sm font-semibold tracking-[0.3em] uppercase">
            <Sparkles className="w-4 h-4 text-[#C3143D]" /> We Are Revo
          </span>
          <div className="w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
        </motion.div>

        {/* Main Title Group */}
        <div className="flex flex-col items-center text-center">
          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-sora font-black uppercase tracking-tighter text-white leading-[0.9]"
            >
              Digital
            </motion.h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
              className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[200px]"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
              className="relative"
            >
              <h1 className="text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-serif italic leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pr-4">
                Mastery
              </h1>
              {/* Subtle text glow */}
              <h1 className="absolute inset-0 text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-serif italic leading-[0.9] text-white opacity-20 blur-2xl pointer-events-none">
                Mastery
              </h1>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
              className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[200px]"
            />
          </div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="max-w-2xl text-center text-white/60 text-base md:text-xl font-light mt-8 md:mt-12 leading-relaxed"
        >
          Transforming bold ideas into unforgettable digital experiences. 
          We blend cinematic storytelling with cutting-edge production to elevate your brand beyond the ordinary.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mt-10 md:mt-16"
        >
          <button className="group relative px-8 py-4 md:px-10 md:py-5 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm shadow-[0_0_30px_rgba(195,20,61,0.3)] hover:shadow-[0_0_50px_rgba(195,20,61,0.5)] transition-all duration-500">
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative flex items-center gap-3">
              Explore Our Work <Play size={16} className="fill-current" />
            </span>
          </button>
          
          <button className="group px-8 py-4 md:px-10 md:py-5 bg-transparent text-white border border-white/20 rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm hover:border-white hover:bg-white/5 transition-all duration-500">
            Let's Talk
          </button>
        </motion.div>

        {/* ── MOBILE ELEGANT COLLAGE ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1 }}
          className="w-full flex md:hidden justify-center items-center mt-20 relative px-4"
        >
          <motion.div 
            style={{ rotate: mobileRotate1, y: mobileY1 }}
            className="w-36 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 -mr-8 origin-bottom-right"
          >
             <img src="/images/auth-bg.jpg" className="w-full h-full object-cover scale-110" alt="Production" />
             <div className="absolute inset-0 bg-[#C3143D]/20 mix-blend-overlay" />
          </motion.div>
          <motion.div 
            style={{ rotate: mobileRotate2, y: mobileY2 }}
            className="w-44 h-56 rounded-2xl overflow-hidden border border-[#C3143D]/30 shadow-[0_0_40px_rgba(195,20,61,0.2)] relative z-20 mt-12 origin-top-left"
          >
             <motion.img 
               style={{ scale: mobileScaleImg }}
               src="/images/agency_hero_bg.jpg" 
               className="w-full h-full object-cover" 
               alt="Creative" 
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-40" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── ROTATING BADGE ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
        className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-32 h-32 md:w-40 md:h-40 hidden lg:flex items-center justify-center cursor-pointer group z-20"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
            <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
              <textPath href="#circlePath" startOffset="0%">★ REVO DIGITAL AGENCY ★ CRAFTING MASTERPIECES</textPath>
            </text>
          </svg>
        </motion.div>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#050505]/50 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-700 shadow-2xl">
          <ArrowDown className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
      </motion.div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
