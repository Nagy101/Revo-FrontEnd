"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { ArrowDown, Eye, Zap, Award, Sparkles, ArrowUpRight, Quote } from "lucide-react"
import Link from "next/link"

const EASE = [0.16, 1, 0.3, 1] as const

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Hero Scroll Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.15], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1])
  
  const floatY1 = useTransform(scrollYProgress, [0, 0.2], [0, -200])
  const floatY2 = useTransform(scrollYProgress, [0, 0.2], [0, -300])

  // Mobile Collage Scroll Effects
  const mobileRotate1 = useTransform(scrollYProgress, [0, 0.2], [-8, -25])
  const mobileY1 = useTransform(scrollYProgress, [0, 0.2], [0, -80])
  const mobileRotate2 = useTransform(scrollYProgress, [0, 0.2], [6, 20])
  const mobileY2 = useTransform(scrollYProgress, [0, 0.2], [0, 50])

  // Mouse Tracking for Interactions
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

  // Floating Image Parallax mapped to Mouse
  const imgX1 = useTransform(smoothX, [-1, 1], [-40, 40])
  const imgY1 = useTransform(smoothY, [-1, 1], [-40, 40])
  const imgX2 = useTransform(smoothX, [-1, 1], [50, -50])
  const imgY2 = useTransform(smoothY, [-1, 1], [50, -50])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] selection:bg-[#C3143D] selection:text-white overflow-hidden font-sans">
      
      {/* =========================================
          1. WORLD-CLASS HERO SECTION (Matches Home)
          ========================================= */}
      <section className="relative w-full min-h-[100dvh] h-auto lg:min-h-[900px] flex flex-col items-center justify-center overflow-hidden">
        
        {/* BASE BACKGROUND */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 origin-top will-change-transform"
        >
          <img 
            src="/images/auth-bg.jpg" 
            alt="About Revo Background" 
            className="w-full h-full object-cover opacity-[0.25] grayscale-[30%] blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-full" />
        </motion.div>

        {/* MOUSE SPOTLIGHT (GPU ACCELERATED) */}
        {isMounted && (
          <motion.div 
            className="fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
            style={{ 
              background: 'radial-gradient(circle, rgba(195, 20, 61, 0.12) 0%, transparent 60%)',
              x: spotlightX,
              y: spotlightY
            }}
          />
        )}

        {/* FLOATING PARALLAX IMAGES (DESKTOP) */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block max-w-[1600px] mx-auto w-full">
          <motion.div
            style={{ y: floatY1, x: imgX1, rotate: 6 }}
            className="absolute left-[8%] top-[25%] w-64 h-80 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl opacity-70 backdrop-blur-md"
          >
            <img src="/images/agency_hero_bg.jpg" className="w-full h-full object-cover scale-110 grayscale-[10%]" alt="Team" />
            <div className="absolute inset-0 bg-[#050505]/20 mix-blend-overlay" />
          </motion.div>

          <motion.div
            style={{ y: floatY2, x: imgX2, rotate: -8 }}
            className="absolute right-[8%] top-[15%] w-72 h-96 rounded-[2rem] overflow-hidden border border-[#C3143D]/20 shadow-[0_0_40px_rgba(195,20,61,0.15)] opacity-80"
          >
            <img src="/images/auth-bg.jpg" className="w-full h-full object-cover scale-110" alt="Creative Space" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-60" />
          </motion.div>
        </div>

        {/* NOISE OVERLAY */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/images/noise.png")' }} />

        {/* MAIN CONTENT */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center mt-32 md:mt-20"
        >
          {/* Intro Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="flex items-center gap-4 mb-8 md:mb-12"
          >
            <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span className="flex items-center gap-2 text-white/90 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase">
              <Sparkles className="w-4 h-4 text-[#C3143D]" /> The REVO Standard
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
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[150px]"
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="relative"
              >
                <h1 className="text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[9rem] font-serif italic leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pr-4">
                  Legacy
                </h1>
                <h1 className="absolute inset-0 text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[9rem] font-serif italic leading-[0.9] text-white opacity-20 blur-2xl pointer-events-none">
                  Legacy
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[150px]"
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="max-w-3xl text-center text-white/60 text-base md:text-xl font-light mt-8 md:mt-12 leading-relaxed"
          >
            We are the architects of the digital frontier. Born from a relentless pursuit of perfection, REVO doesn't just build brands—we forge industry leaders. We fuse cinematic artistry with cutting-edge technology to craft narratives that dominate the digital space.
          </motion.p>
          
          {/* MOBILE ELEGANT COLLAGE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1 }}
            className="w-full flex md:hidden justify-center items-center mt-16 relative px-4"
          >
            <motion.div 
              style={{ rotate: mobileRotate1, y: mobileY1 }}
              className="w-36 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 -mr-8 origin-bottom-right"
            >
               <img src="/images/agency_hero_bg.jpg" className="w-full h-full object-cover scale-110" alt="Team" />
               <div className="absolute inset-0 bg-[#C3143D]/20 mix-blend-overlay" />
            </motion.div>
            <motion.div 
              style={{ rotate: mobileRotate2, y: mobileY2 }}
              className="w-44 h-56 rounded-2xl overflow-hidden border border-[#C3143D]/30 shadow-[0_0_40px_rgba(195,20,61,0.2)] relative z-20 mt-12 origin-top-left"
            >
               <img src="/images/auth-bg.jpg" className="w-full h-full object-cover scale-125" alt="Creative" />
               <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-40" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ROTATING BADGE */}
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
              <path id="circlePathAbout" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
              <text className="text-[10.5px] uppercase font-bold tracking-[0.25em]">
                <textPath href="#circlePathAbout" startOffset="0%">★ DISCOVER OUR ROOTS ★ KNOW REVO AGENCY</textPath>
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

      {/* =========================================
          2. THE MANIFESTO (WORLD-CLASS DESIGN)
          ========================================= */}
      <section className="relative z-10 py-32 md:py-48 bg-[#050505] overflow-hidden flex flex-col justify-center items-center">
        
        {/* Massive Background Marquee */}
        <div className="absolute top-1/2 -translate-y-1/2 w-[200vw] flex whitespace-nowrap opacity-[0.03] pointer-events-none select-none overflow-hidden mix-blend-screen">
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="text-[12rem] md:text-[25rem] font-black uppercase leading-none tracking-tighter"
          >
            WE REFUSE TO BLEND IN • WE REFUSE TO BLEND IN • 
          </motion.div>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left side: Animated Lines & Title */}
            <div className="w-full lg:w-5/12 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: EASE }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-12 h-[2px] bg-[#C3143D]" />
                <span className="text-[#C3143D] text-xs font-bold tracking-[0.4em] uppercase">Manifesto</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}
                className="text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white tracking-tighter leading-[0.95]"
              >
                The Art <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10 italic font-serif">of War</span><br/>
                Against <br/>
                <span className="text-[#C3143D]">Mediocrity.</span>
              </motion.h2>
            </div>

            {/* Right side: The glassmorphism manifesto text */}
            <div className="w-full lg:w-7/12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                className="relative p-10 md:p-16 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden group"
              >
                {/* Subtle hover gradient inside */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C3143D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out" />
                
                <Quote className="absolute top-10 right-10 text-white/5 w-32 h-32 rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 ease-out" />

                <div className="relative z-10 text-xl md:text-3xl text-white/70 font-light leading-relaxed space-y-10">
                  <p>
                    In a world flooded with digital noise, being 'good' is the fastest way to become invisible. <strong className="text-white font-medium">We refuse to blend in.</strong>
                  </p>
                  <p className="text-white/40">
                    We believe every brand has a masterpiece hidden inside it. Our job is to carve away the excess, elevate the core narrative, and deliver an experience that leaves your audience breathless.
                  </p>
                  <div className="pt-10 mt-10 border-t border-white/10">
                    <p className="text-3xl md:text-5xl text-white italic font-serif leading-tight">
                      "Good design is obvious. Great design is invisible. <span className="text-[#C3143D]">Masterful design is unforgettable.</span>"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          3. CORE VALUES (ULTRA BENTO GRID)
          ========================================= */}
      <section className="relative z-10 py-40 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-4xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C3143D] text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 block"
            >
              Our DNA
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white tracking-tighter leading-[0.9]"
            >
              The Pillars of REVO
            </motion.h2>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 group/bento"
          onMouseMove={(e) => {
            const cards = document.getElementsByClassName("bento-card")
            for (const card of cards) {
              const rect = card.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              ;(card as HTMLElement).style.setProperty("--mouse-x", `${x}px`)
              ;(card as HTMLElement).style.setProperty("--mouse-y", `${y}px`)
            }
          }}
        >
          {/* Card 1: Cinematic Vision (Spans 8 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="bento-card md:col-span-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 md:p-16 relative overflow-hidden group hover:border-white/20 transition-colors duration-500 min-h-[450px] flex flex-col justify-end"
          >
            {/* Hover Glow */}
            <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-20" style={{ background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)" }} />
            
            {/* Background Video / Image */}
            <div className="absolute inset-0 z-0">
               <img src="/images/agency_hero_bg.jpg" className="w-full h-full object-cover opacity-[0.15] mix-blend-luminosity group-hover:opacity-[0.3] group-hover:scale-105 transition-all duration-1000" alt="Cinematic" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            </div>

            <div className="relative z-10 pointer-events-none">
              <Eye size={48} className="text-white/50 mb-8 group-hover:text-white transition-colors duration-500" />
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Cinematic Vision</h3>
              <p className="text-white/40 text-xl max-w-xl leading-relaxed">Every project is treated like a blockbuster film. High production value, intense attention to detail, and relentless storytelling.</p>
            </div>
          </motion.div>

          {/* Card 2: Unrelenting Innovation (Spans 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="bento-card md:col-span-4 bg-gradient-to-br from-[#C3143D] to-[#8a0e2b] rounded-[2.5rem] border border-[#ff4d79]/30 p-10 md:p-12 relative overflow-hidden group hover:shadow-[0_0_60px_rgba(195,20,61,0.4)] transition-all duration-500 min-h-[450px]"
          >
            <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 mix-blend-overlay z-20" style={{ background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 40%)" }} />
            
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 group-hover:rotate-12 group-hover:scale-125 transition-all duration-700 pointer-events-none">
               <Zap size={180} className="text-white" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                 <Zap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Unrelenting <br/>Innovation</h3>
                <p className="text-white/80 text-lg leading-relaxed">Adopting the absolute latest technologies to keep you lightyears ahead.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Mastercraft Quality (Spans 5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="bento-card md:col-span-5 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 md:p-12 relative overflow-hidden group hover:border-white/20 transition-colors duration-500 min-h-[400px]"
          >
            <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-20" style={{ background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)" }} />
            
            <div className="relative z-10 pointer-events-none">
              <Award size={48} className="text-white/10 mb-8 group-hover:text-[#C3143D] group-hover:scale-110 transition-all duration-500 origin-left" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Mastercraft Quality</h3>
              <p className="text-white/40 text-lg leading-relaxed max-w-sm">Zero compromises. If it's not pixel-perfect, it simply does not ship. Excellence is our baseline.</p>
            </div>
          </motion.div>

          {/* Card 4: Global Reach (Spans 7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="bento-card md:col-span-7 bg-[#111] rounded-[2.5rem] border border-white/5 p-10 md:p-16 relative overflow-hidden group hover:border-white/20 transition-colors duration-500 min-h-[400px] flex items-center"
          >
            <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-20" style={{ background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)" }} />
            
            <div className="absolute inset-0 z-0 pointer-events-none">
               {/* Abstract background elements */}
               <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-white/5 rounded-full border-dashed group-hover:rotate-45 transition-transform duration-[20s] ease-linear opacity-50" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-[#C3143D]/20 rounded-full group-hover:-rotate-90 transition-transform duration-[30s] ease-linear" />
            </div>
            
            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pointer-events-none">
              <div className="max-w-md">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Global Reach, <br/><span className="text-white/40 italic font-serif">Local Touch</span></h3>
                <p className="text-white/50 text-xl leading-relaxed">Based in creative capitals, delivering world-class digital experiences to forward-thinking brands internationally.</p>
              </div>
              <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:scale-110 transition-all duration-500 pointer-events-auto cursor-pointer shadow-xl">
                <ArrowUpRight size={32} className="text-[#C3143D] group-hover:text-black transition-colors" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          4. TEAM PREVIEW (WORLD-CLASS ACCORDION)
          ========================================= */}
      <section className="relative z-10 py-32 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
           <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[#C3143D] text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 block"
              >
                The Collective
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight"
              >
                Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 italic font-serif">Masters.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-xl leading-relaxed max-w-lg"
              >
                A tight-knit collective of award-winning designers, visionary developers, and brilliant brand strategists orchestrating digital perfection.
              </motion.p>
           </div>
         </div>

         {/* Responsive Team Layout */}
         <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[650px] w-full">
           {[
             { name: "Julian Rossi", role: "CEO / Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
             { name: "Sarah Jenkins", role: "Creative Director", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" },
             { name: "Marcus Chen", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" },
             { name: "Elena Rostova", role: "Art Director", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop" }
           ].map((member, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
               className="group relative w-full h-[350px] lg:h-full lg:flex-1 lg:hover:flex-[3] transition-all duration-700 ease-[0.16,1,0.3,1] rounded-[2.5rem] overflow-hidden cursor-pointer bg-[#050505] border border-white/5 shadow-2xl"
             >
               {/* Background Image */}
               <div className="absolute inset-0 z-0">
                 <img 
                   src={member.img} 
                   alt={member.name}
                   className="w-full h-full object-cover lg:grayscale-[100%] contrast-125 lg:opacity-40 lg:group-hover:grayscale-0 lg:group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:opacity-50 lg:group-hover:opacity-90 transition-opacity duration-700" />
               </div>

               {/* Inner Border glow on hover */}
               <div className="absolute inset-0 border-[2px] border-transparent lg:group-hover:border-[#C3143D]/50 rounded-[2.5rem] transition-colors duration-700 z-20 pointer-events-none hidden lg:block" />

               {/* Content Details */}
               <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end">
                 {/* Desktop specific translation logic */}
                 <div className="lg:translate-y-12 lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                   <h3 className="text-3xl font-black text-white mb-2 tracking-tight lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">{member.name}</h3>
                   
                   {/* Role & Socials Container */}
                   <div className="h-auto lg:h-0 lg:group-hover:h-[60px] overflow-hidden opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 ease-out delay-100 mt-2">
                     <p className="text-[#C3143D] text-sm font-bold tracking-widest uppercase mb-4">{member.role}</p>
                     <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white/50 hover:text-black text-[10px] font-bold">IN</div>
                       <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white/50 hover:text-black text-[10px] font-bold">TW</div>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Vertical Name Overlay for Desktop Idle State */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 hidden lg:block opacity-100 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none">
                 <span className="text-white/20 text-4xl font-black uppercase tracking-[0.3em] whitespace-nowrap mix-blend-overlay">{member.name}</span>
               </div>
             </motion.div>
           ))}
         </div>
      </section>

      {/* =========================================
          5. GIANT CTA (WORLD-CLASS DESIGN)
          ========================================= */}
      <section className="relative z-10 pt-32 pb-48 w-full border-t border-white/5 overflow-hidden flex flex-col items-center justify-center">
        {/* Deep Red Background Glow */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#C3143D]/20 blur-[200px] rounded-[100%] pointer-events-none z-0" />
        
        {/* Premium Abstract Architectural Grid */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center w-full text-center">
          
          {/* Floating Glow Badge */}
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="mb-16 relative"
          >
            <div className="absolute inset-0 bg-[#C3143D] blur-2xl opacity-50 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-[#050505]/50 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <Sparkles size={32} className="text-[#C3143D]" />
            </div>
          </motion.div>

          {/* Oversized Cinematic Typography */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-[12vw] sm:text-[8rem] lg:text-[11rem] font-black text-white leading-[0.85] tracking-tighter uppercase relative z-10">
              Ready to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#C3143D] to-[#ff4d79] italic font-serif lowercase tracking-normal pr-4">start?</span>
            </h2>
            
            {/* Background Text Shadow/Glow */}
            <h2 className="absolute top-0 left-1/2 -translate-x-1/2 text-[12vw] sm:text-[8rem] lg:text-[11rem] font-black leading-[0.85] tracking-tighter uppercase z-0 opacity-20 blur-3xl text-white pointer-events-none">
              Ready to <br/>start?
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="text-white/40 text-xl md:text-2xl mt-12 max-w-2xl font-light"
          >
            Let's architect something unforgettable together. The next era of your brand begins here.
          </motion.p>

          {/* Interactive Oversized Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
            className="mt-16"
          >
            <Link href="/contact" className="group relative inline-flex items-center justify-center gap-6 px-12 py-6 bg-white rounded-full overflow-hidden hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(195,20,61,0.3)]">
               {/* Hover Swipe Fill */}
               <div className="absolute inset-0 w-full h-full bg-[#C3143D] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] rounded-full" />
               
               <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-[0.2em] text-sm md:text-base transition-colors duration-500">Initiate Project</span>
               
               <div className="relative z-10 w-12 h-12 rounded-full bg-black group-hover:bg-white flex items-center justify-center transition-colors duration-500 shadow-xl">
                 <ArrowUpRight size={20} className="text-white group-hover:text-[#C3143D] transition-colors duration-500" />
               </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
