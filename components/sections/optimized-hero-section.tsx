"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { ArrowDown, Play, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const EASE = [0.16, 1, 0.3, 1] as const

export function OptimizedHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { isArabic } = useLanguage()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleScrollDown = () => {
    const nextSection = containerRef.current?.nextElementSibling as HTMLElement
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Scroll Parallax Effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  // Mouse Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mousePixelX = useMotionValue(0)
  const mousePixelY = useMotionValue(0)

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

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen pt-16 sm:pt-20 md:pt-20 pb-6 flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── BASE BACKGROUND ── */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0 origin-top will-change-transform"
      >
        <img 
          src="/images/revo-hero-bg.jpg" 
          alt="Revo Production Atmosphere" 
          className="w-full h-full object-cover object-[center_60%] sm:object-bottom opacity-85"
        />
        {/* Subtle overlays: dark at top for navbar, transparent in center, soft transition at bottom */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/60" />
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

      {/* ── NOISE OVERLAY (GPU OPTIMIZED) ── */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/images/noise.png")' }} />

      {/* ── MAIN CONTENT (BALANCED POSITIONING) ── */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center justify-center text-center"
      >
        
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="flex items-center gap-3 mb-2.5 md:mb-4"
        >
          <div className="w-8 md:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#C3143D]" />
          <span className="flex items-center gap-2 text-white/90 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase drop-shadow">
            <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" /> {isArabic ? "نحن ريفو" : "We Are Revo"}
          </span>
          <div className="w-8 md:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
        </motion.div>

        {/* Main Title Group */}
        <div className="flex flex-col items-center text-center">
          <div className="overflow-hidden pb-1">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sora font-black uppercase tracking-tight text-white leading-[1] drop-shadow-2xl"
            >
              {isArabic ? "كل كادر" : "Every Frame"}
            </motion.h1>
          </div>
          
          <div className="flex items-center justify-center gap-3 md:gap-6 overflow-hidden w-full mt-1">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
              className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[100px]"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
              className="relative"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic leading-[1] text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] pr-3 drop-shadow-2xl">
                {isArabic ? "وراه حكاية." : "Has A Story."}
              </h1>
              {/* Subtle text glow */}
              <h1 className="absolute inset-0 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic leading-[1] text-[#C3143D] opacity-25 blur-2xl pointer-events-none">
                {isArabic ? "وراه حكاية." : "Has A Story."}
              </h1>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
              className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[100px]"
            />
          </div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="max-w-xl text-center text-white/90 text-xs sm:text-sm md:text-base font-light mt-2.5 sm:mt-3 leading-relaxed [text-shadow:_0_1px_12px_rgba(0,0,0,0.8)]"
        >
          {isArabic ? (
            <>نحوّل الفعاليات والأفكار والعلامات التجارية إلى قصص بصرية تعيش في الذاكرة. من التغطيات السينمائية الكبرى إلى الإعلانات المؤثرة والأفلام الإبداعية، تقدّم <span className="text-white font-semibold">REVO</span> الرؤية، والفريق، والطاقة لتحويل كل لقطة إلى عمل لا يُنسى.</>
          ) : (
            <>We turn events, ideas, and brands into visual stories people remember. From cinematic event coverage to high-impact ads and creative films, <span className="text-white font-semibold">REVO</span> brings the vision, the crew, and the energy to make every frame count.</>
          )}
        </motion.p>

        {/* Action Buttons (Compact horizontal row on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="flex flex-row items-center justify-center gap-3 sm:gap-4 mt-3.5 sm:mt-5"
        >
          <Link 
            href="/portfolio"
            className="group relative px-5 py-2.5 sm:px-7 sm:py-3 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs sm:text-sm shadow-[0_0_25px_rgba(195,20,61,0.4)] hover:shadow-[0_0_45px_rgba(195,20,61,0.6)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative flex items-center gap-2">
              {isArabic ? "استكشف أعمالنا" : "Explore Our Work"}{" "}
              <Play size={12} className="fill-current rtl:rotate-180" />
            </span>
          </Link>
          
          <Link 
            href="/contact"
            className="group px-5 py-2.5 sm:px-7 sm:py-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold tracking-widest uppercase text-xs sm:text-sm hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
          >
            {isArabic ? "تواصل معنا" : "Let's Talk"}
          </Link>
        </motion.div>

        {/* ── CINEMATIC CONCERT CARDS DUO (100% CLEAN PHOTO VISIBILITY) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
          className="flex flex-row items-end justify-center gap-3 sm:gap-5 mt-4 sm:mt-6 w-full max-w-xl mx-auto z-20"
        >
          {/* Card 1: Singer Stage (Natural 2:3 Portrait - 100% Unobstructed) */}
          <Link href="/portfolio" className="w-[120px] xs:w-[135px] sm:w-[155px] md:w-[170px] shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative w-full aspect-[2/3] rounded-2xl p-1 bg-black/60 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(195,20,61,0.25)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer -rotate-1 hover:rotate-0"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="/images/revo-singer.jpg" 
                  alt="Live Stage - Cairokee" 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                />
                {/* Subtle soft bottom shadow only - leaves performers 100% clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Clean Bottom Label */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
                  <p className="text-[9px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {isArabic ? "إمبراطورية كايروكي" : "Cairokee Empire"}
                  </p>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                    <Play size={7} className="fill-current text-white translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 2: Acoustic Sessions (Natural 3:2 Landscape - 100% Unobstructed) */}
          <Link href="/portfolio" className="w-[175px] xs:w-[195px] sm:w-[230px] md:w-[255px] shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative w-full aspect-[3/2] rounded-2xl p-1 bg-black/60 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(195,20,61,0.25)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer rotate-1 hover:rotate-0"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="/images/revo-band.jpg" 
                  alt="Acoustic Sessions" 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                />
                {/* Subtle soft bottom shadow only - leaves musicians 100% clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Clean Bottom Label */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
                  <p className="text-[9px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {isArabic ? "جلسات أكوستيك" : "Acoustic Sessions"}
                  </p>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                    <Play size={7} className="fill-current text-white translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── ROTATING BADGE ── */}
      <motion.div 
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        aria-label="Scroll down"
        initial={{ opacity: 0, scale: 0 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
        className="absolute bottom-16 right-6 md:bottom-20 md:right-8 w-24 h-24 md:w-28 md:h-28 hidden lg:flex items-center justify-center cursor-pointer group z-20 select-none"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
            <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
              <textPath href="#circlePath" startOffset="0%">★ REVO DIGITAL AGENCY ★ CRAFTING MASTERPIECES</textPath>
            </text>
          </svg>
        </motion.div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#050505]/50 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-700 shadow-2xl">
          <ArrowDown className="text-white w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </motion.div>

      {/* Subtle bottom edge fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
