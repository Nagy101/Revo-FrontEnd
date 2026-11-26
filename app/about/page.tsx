"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { 
  ArrowDown, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight,
  Play, 
  Target, 
  Compass, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Palette, 
  Camera, 
  Film, 
  Calendar, 
  Briefcase, 
  Rocket, 
  Mic2, 
  Quote,
  Gem,
  Flame,
  Crown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const EASE = [0.16, 1, 0.3, 1] as const

// Real Team & Leadership Data (Clean & Accurate)
const TEAM_MEMBERS = [
  {
    nameEn: "Hossam Shaaban",
    roleEn: "Co-Founder",
    isFounder: true,
    image: "/images/team/hossam-shaaban.jpg",
    number: "01"
  },
  {
    nameEn: "Bassiouny",
    roleEn: "Co-Founder",
    isFounder: true,
    image: "/images/team/bassiouny.jpg",
    number: "02"
  },
  {
    nameEn: "Ibrahim Fayda",
    roleEn: "Co-Founder",
    isFounder: true,
    image: "/images/team/ibrahim-fayda-portrait.jpg",
    number: "03"
  },
  {
    nameEn: "Samir Saeed",
    roleEn: "Full-Time Team",
    isFounder: false,
    image: "/images/team/samir-saeed.jpg",
    number: "04"
  }
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth < 768)
  }, [])

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  // Hero Scroll Parallax (Smooth & Jitter-Free on Mobile)
  const rawHeroY = useTransform(heroScroll, [0, 1], ["0%", "40%"])
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0])
  const rawHeroScale = useTransform(heroScroll, [0, 1], [1, 1.1])
  const heroY = isMobile ? "0%" : rawHeroY
  const heroScale = isMobile ? 1 : rawHeroScale

  // Mouse Tracking for Global Ambient Spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mousePixelX = useMotionValue(0)
  const mousePixelY = useMotionValue(0)

  const smoothPixelX = useSpring(mousePixelX, { damping: 40, stiffness: 150, mass: 0.5 })
  const smoothPixelY = useSpring(mousePixelY, { damping: 40, stiffness: 150, mass: 0.5 })

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return
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

  const handleScrollDown = () => {
    const nextSection = heroRef.current?.nextElementSibling as HTMLElement
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  // Interactive card mouse movement handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] selection:bg-[#C3143D] selection:text-white overflow-hidden font-sans">
      
      {/* =========================================
          1. HERO SECTION (Exact Screen-Fit Like Home)
          ========================================= */}
      <section 
        ref={heroRef}
        className="relative w-full min-h-screen pt-16 sm:pt-20 md:pt-20 pb-6 flex items-center justify-center overflow-hidden bg-[#050505]"
      >
        {/* BASE BACKGROUND (Exact Home Stadium Fireworks Background) */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 origin-top will-change-transform"
        >
          <Image 
            src="/images/revo-hero-bg.jpg" 
            alt="About REVO Background" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-85"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/60" />
        </motion.div>

        {/* MOUSE SPOTLIGHT (DESKTOP ONLY - GPU ACCELERATED) */}
        {isMounted && (
          <motion.div 
            className="hidden md:block fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
            style={{ 
              background: 'radial-gradient(circle, rgba(195, 20, 61, 0.15) 0%, transparent 60%)',
              x: spotlightX,
              y: spotlightY
            }}
          />
        )}

        {/* NOISE OVERLAY */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("/images/noise.png")' }} />

        {/* MAIN HERO CONTENT (Calibrated with clearance for fixed navbar) */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center"
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
              <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" /> About REVO
            </span>
            <div className="w-8 md:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>

          {/* Main Title Group (Fit on 2 crisp lines, no wrapping, matching Home stature) */}
          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden pb-1">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-sora font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-2xl whitespace-nowrap"
              >
                We’re Here To Make
              </motion.h1>
            </div>
            
            <div className="flex items-center justify-center gap-3 md:gap-5 overflow-hidden w-full mt-0.5">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[80px]"
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="relative whitespace-nowrap"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif italic leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] pr-2 drop-shadow-2xl">
                  Visuals Mean Something.
                </h1>
                <h1 className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif italic leading-[1.05] text-[#C3143D] opacity-25 blur-2xl pointer-events-none">
                  Visuals Mean Something.
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[80px]"
              />
            </div>
          </div>

          {/* Description Group */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="max-w-xl text-center text-white/90 text-xs sm:text-sm font-light mt-2.5 md:mt-3.5 leading-relaxed [text-shadow:_0_1px_12px_rgba(0,0,0,0.8)]"
          >
            We’re <span className="text-white font-semibold">REVO</span> — a creative media production team bringing ideas to life through photography, filmmaking, and bold visual storytelling. From live events to brand identities, we create content that captures attention and leaves a lasting impression.
          </motion.p>

          {/* Punchline Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.8 }}
            className="flex items-center gap-3 mt-2 text-red-200/90 font-serif italic text-xs sm:text-sm tracking-wide [text-shadow:_0_1px_10px_rgba(0,0,0,0.8)]"
          >
            <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span>“Let’s make something worth remembering.”</span>
            <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>

          {/* Action Buttons (Matches Home exactly) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="flex flex-row items-center gap-3.5 md:gap-4 mt-4 md:mt-5"
          >
            <Link 
              href="/portfolio"
              className="group relative px-6 py-2.5 md:px-7 md:py-3 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm shadow-[0_0_25px_rgba(195,20,61,0.4)] hover:shadow-[0_0_45px_rgba(195,20,61,0.6)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-cinematic" />
              <span className="relative flex items-center gap-2">
                Explore Our Work <Play size={12} className="fill-current" />
              </span>
            </Link>
            
            <Link 
              href="/contact"
              className="group px-6 py-2.5 md:px-7 md:py-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
            >
              Let’s Talk
            </Link>
          </motion.div>

          {/* ── CINEMATIC CONCERT CARDS DUO (FULL ORIGINAL 2:3 PHOTOS - 100% VISIBLE) ── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
            className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-5 w-full max-w-xl mx-auto z-20"
          >
            {/* Card 1: Singer Stage (Full Photo 100% Unobstructed) */}
            <Link href="/portfolio" className="w-[125px] sm:w-[145px] md:w-[160px]">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative w-full aspect-[2/3] rounded-2xl p-1 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer -rotate-1 hover:rotate-0"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image src="/images/revo-about-card1.jpg" alt="Stage Energy" fill sizes="(max-width: 640px) 145px, 160px" className="object-cover group-hover:scale-108 transition-transform duration-500" />
                  {/* Soft bottom shadow only - leaves performers 100% clear */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Clean Bottom Label */}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
                    <p className="text-[10px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Stage Energy
                    </p>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                      <Play size={7} className="fill-current text-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Card 2: Singer Performance (Full Photo 100% Unobstructed) */}
            <Link href="/portfolio" className="w-[125px] sm:w-[145px] md:w-[160px]">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative w-full aspect-[2/3] rounded-2xl p-1 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer rotate-1 hover:rotate-0"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image src="/images/revo-about-card2.jpg" alt="Raw Performance" fill sizes="(max-width: 640px) 145px, 160px" className="object-cover group-hover:scale-108 transition-transform duration-500" />
                  {/* Soft bottom shadow only - leaves performers 100% clear */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Clean Bottom Label */}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
                    <p className="text-[10px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Raw Vocal
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

        {/* ROTATING BADGE */}
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
              <path id="circlePathAbout" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
              <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
                <textPath href="#circlePathAbout" startOffset="0%">
                  ★ DISCOVER OUR ROOTS ★ KNOW REVO AGENCY
                </textPath>
              </text>
            </svg>
          </motion.div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#050505]/50 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-700 shadow-2xl">
            <ArrowDown className="text-white w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
      </section>

      {/* =========================================
          KINETIC MARQUEE (PURE GPU CSS KEYFRAMES - ZERO RESET JITTER)
          ========================================= */}
      <style>{`
        @keyframes revoAboutMarqueeTrack {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .revo-about-marquee {
          display: flex;
          width: max-content;
          animation: revoAboutMarqueeTrack 34s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="relative py-3.5 bg-[#080808] border-y border-white/10 overflow-hidden select-none z-10" dir="ltr">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
        <div className="revo-about-marquee items-center gap-8 text-xs md:text-sm font-sora font-extrabold uppercase tracking-[0.3em] text-white/40">
          {[0, 1].map((setIndex) => (
            <div key={`about-set-${setIndex}`} className="flex items-center gap-8 shrink-0">
              {[...Array(3)].map((_, i) => (
                <div key={`about-item-${setIndex}-${i}`} className="flex items-center gap-8 shrink-0">
                  <span className="text-white">Live Experiences</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                  <span className="text-white/80">Cinematic Storytelling</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                  <span className="text-white">Commercial Campaigns</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                  <span className="text-white/80">High-Production Films</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                  <span className="text-[#C3143D] font-bold">REVO Creative House</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          2. THE REVO PHILOSOPHY (MORE THAN A CREW)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#050505] overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C3143D]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left side: Editorial Statement */}
            <div className="lg:col-span-5 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-8 h-[2px] bg-[#C3143D]" />
                <span className="text-[#C3143D] text-xs font-bold tracking-[0.3em] uppercase">
                  Who We Are
                </span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase leading-[1.15]"
              >
                More Than A Production Crew. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] font-serif italic lowercase tracking-normal">
                  a creative partner.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                className="mt-5 text-white/50 text-sm leading-relaxed"
              >
                We bridge the gap between technical production mastery and high-level creative vision to build memorable media that commands attention.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {["Live Events", "Commercial Campaigns", "Brand Storytelling", "Cinematography"].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/70 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right side: Glassmorphism Story Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="lg:col-span-7 relative p-7 md:p-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#C3143D]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#C3143D]/20 transition-all duration-700" />
              <Quote className="absolute top-6 right-8 text-white/[0.03] w-24 h-24 pointer-events-none rotate-12 group-hover:text-white/[0.06] transition-colors duration-700" />

              <div className="relative z-10 space-y-5 text-white/80 text-base md:text-lg font-light leading-relaxed">
                <p className="text-white text-lg md:text-xl font-normal leading-snug">
                  At <span className="text-white font-semibold underline decoration-[#C3143D] underline-offset-4">REVO</span>, we believe great content is more than a good-looking shot. It’s about understanding the vision, capturing the right moments, and turning ideas into experiences people connect with.
                </p>
                <p className="text-white/70">
                  We bring creativity, production, and storytelling together to help brands, businesses, and event organizers show up with confidence.
                </p>
                <div className="border-l-2 border-[#C3143D] pl-4 py-1">
                  <p className="text-white/85 text-sm md:text-base italic font-serif leading-relaxed">
                    “Whether it’s a live event, a commercial campaign, or a short-form social video, we approach every project with fresh ideas, attention to detail, and a commitment to getting the story right.”
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          3. LEADERSHIP & CORE TEAM (CLEAN & MINIMALIST)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#070707] border-y border-white/5 overflow-hidden">
        {/* Ambient Red Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C3143D]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3"
              >
                <Crown className="w-3.5 h-3.5 text-[#C3143D]" />
                <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                  Leadership & Core Team
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase"
              >
                The Minds Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">REVO.</span>
              </motion.h2>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm max-w-md font-light"
            >
              The co-founders and key specialists driving the vision, direction, and execution of REVO.
            </motion.p>
          </div>

          {/* 4 Clean Minimalist Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: EASE }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-2xl md:rounded-[1.75rem] overflow-hidden bg-[#0c0c0c] border border-white/10 hover:border-[#C3143D]/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(195,20,61,0.25)] transition-all duration-500 cursor-pointer flex flex-col aspect-[3/4]"
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.nameEn} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-106 group-hover:contrast-105 transition-all duration-700 ease-out"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#C3143D]/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Top Bar: Badge & Number */}
                <div className="relative z-10 p-4 md:p-5 flex items-center justify-between">
                  {member.isFounder ? (
                    <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C3143D]/50 text-white flex items-center gap-1.5 shadow-lg">
                      <Crown className="w-3 h-3 text-[#C3143D]" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                        Co-Founder
                      </span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-white flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-200">
                        Full-Time
                      </span>
                    </div>
                  )}

                  <span className="text-white/30 font-sora font-extrabold text-xs tracking-wider group-hover:text-white/60 transition-colors">
                    {member.number}
                  </span>
                </div>

                {/* Bottom Content Area (Minimalist: Name & Role Badge Only) */}
                <div className="relative z-10 mt-auto p-5 md:p-6 flex flex-col justify-end">
                  <span className="text-[#C3143D] text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase mb-1 drop-shadow">
                    {member.roleEn}
                  </span>

                  <h3 className="text-xl md:text-2xl font-sora font-extrabold text-white tracking-tight group-hover:text-red-100 transition-colors drop-shadow-md">
                    {member.nameEn}
                  </h3>
                </div>

                {/* Subtle Sheen Streak Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 pointer-events-none" />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================
          4. OUR MISSION & VISION (DUAL NORTH STAR)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#050505] overflow-hidden">
        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                Guiding Purpose
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase"
            >
              Our Mission & Vision
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card 1: Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative rounded-[2rem] p-7 md:p-10 bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/10 hover:border-[#C3143D]/50 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(195,20,61,0.2)] transition-all duration-500 group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-6 text-white/[0.04] text-6xl font-sora font-extrabold select-none pointer-events-none group-hover:text-white/[0.08] transition-colors">
                01
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C3143D]/10 border border-[#C3143D]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C3143D] transition-all duration-500">
                  <Target className="w-5 h-5 text-[#C3143D] group-hover:text-white transition-colors" />
                </div>

                <span className="text-[#C3143D] text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                  Our Mission
                </span>

                <h3 className="text-2xl sm:text-3xl font-sora font-extrabold text-white mb-4 uppercase tracking-tight">
                  Turn Ideas Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">Experiences.</span>
                </h3>

                <div className="space-y-3 text-white/70 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    Our mission is to help brands and businesses communicate through powerful visual content.
                  </p>
                  <p className="text-white/60">
                    We combine creative thinking with thoughtful production to capture moments, communicate messages, and create work that connects with the right audience.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-white/40 group-hover:text-white transition-colors">
                <span>Impact-Driven Production</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Card 2: Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="relative rounded-[2rem] p-7 md:p-10 bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/10 hover:border-[#C3143D]/50 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(195,20,61,0.2)] transition-all duration-500 group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-6 text-white/[0.04] text-6xl font-sora font-extrabold select-none pointer-events-none group-hover:text-white/[0.08] transition-colors">
                02
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-500">
                  <Compass className="w-5 h-5 text-white transition-colors" />
                </div>

                <span className="text-[#C3143D] text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                  Our Vision
                </span>

                <h3 className="text-2xl sm:text-3xl font-sora font-extrabold text-white mb-4 uppercase tracking-tight">
                  Make Every Frame <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">Count.</span>
                </h3>

                <div className="space-y-3 text-white/70 text-sm md:text-base font-light leading-relaxed">
                  <p>
                    We aim to become a trusted creative media partner for brands, businesses, and event organizers — known for our distinctive visual style, collaborative spirit, and consistent commitment to quality.
                  </p>
                  <p className="text-white/60">
                    We want every project to do more than look good. <strong className="text-white font-medium">We want it to mean something.</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-white/40 group-hover:text-white transition-colors">
                <span>Distinctive Visual Style</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          5. WHAT DRIVES US (CREATIVITY WITH PURPOSE)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#070707] border-y border-white/5">
        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3"
              >
                <Flame className="w-3.5 h-3.5 text-[#C3143D]" />
                <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                  What Drives Us
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase"
              >
                Creativity With <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">Purpose.</span>
              </motion.h2>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm max-w-md font-light"
            >
              The five core principles that define how we create, collaborate, and consistently deliver.
            </motion.p>
          </div>

          {/* 5-Card Compact Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Card 1: Creative by Nature (Spans 7 cols) */}
            <motion.div 
              onMouseMove={handleCardMouseMove}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="md:col-span-7 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/10 hover:border-[#C3143D]/40 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[220px]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10" style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,20,61,0.15), transparent 40%)" }} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/20 font-sora font-extrabold text-xl">01</span>
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="text-xl font-sora font-bold text-white mb-2">
                  Creative by Nature
                </h3>
                <p className="text-white/70 text-sm font-light leading-relaxed max-w-lg">
                  We explore fresh ideas, experiment with visual styles, and look for new ways to tell stories that cut through the noise.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Quality in Every Detail (Spans 5 cols) */}
            <motion.div 
              onMouseMove={handleCardMouseMove}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="md:col-span-5 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[#C3143D]/20 via-[#111111] to-[#0a0a0a] border border-white/10 hover:border-[#C3143D]/60 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[220px]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10" style={{ background: "radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1), transparent 40%)" }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#C3143D]/20 border border-[#C3143D]/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                  <Gem className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/20 font-sora font-extrabold text-xl">02</span>
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="text-xl font-sora font-bold text-white mb-2">
                  Quality in Every Detail
                </h3>
                <p className="text-white/70 text-sm font-light leading-relaxed">
                  From the first frame to the final edit, we care about the details that bring a project together and make it timeless.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Built on Collaboration (Spans 4 cols) */}
            <motion.div 
              onMouseMove={handleCardMouseMove}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="md:col-span-4 rounded-2xl p-6 md:p-7 bg-[#0d0d0d] border border-white/10 hover:border-white/25 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[210px]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10" style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,20,61,0.1), transparent 40%)" }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                  <Users className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                </div>
                <span className="text-white/20 font-sora font-extrabold text-xl">03</span>
              </div>

              <div className="relative z-10 mt-5">
                <h3 className="text-lg font-sora font-bold text-white mb-1.5">
                  Built on Collaboration
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                  The best work happens when ideas are shared. We work closely with our clients to bring their vision to life.
                </p>
              </div>
            </motion.div>

            {/* Card 4: A Partner You Can Trust (Spans 4 cols) */}
            <motion.div 
              onMouseMove={handleCardMouseMove}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="md:col-span-4 rounded-2xl p-6 md:p-7 bg-[#0d0d0d] border border-white/10 hover:border-white/25 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[210px]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10" style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,20,61,0.1), transparent 40%)" }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/20 font-sora font-extrabold text-xl">04</span>
              </div>

              <div className="relative z-10 mt-5">
                <h3 className="text-lg font-sora font-bold text-white mb-1.5">
                  A Partner You Can Trust
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                  Strong partnerships are built through clear communication, consistency, and a shared commitment.
                </p>
              </div>
            </motion.div>

            {/* Card 5: Always Evolving (Spans 4 cols) */}
            <motion.div 
              onMouseMove={handleCardMouseMove}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="md:col-span-4 rounded-2xl p-6 md:p-7 bg-[#0d0d0d] border border-white/10 hover:border-white/25 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[210px]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 z-10" style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,20,61,0.1), transparent 40%)" }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/20 font-sora font-extrabold text-xl">05</span>
              </div>

              <div className="relative z-10 mt-5">
                <h3 className="text-lg font-sora font-bold text-white mb-1.5">
                  Always Evolving
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                  We stay curious, explore new formats, and adapt to the changing ways people discover content.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          6. OUR APPROACH (FROM IDEA TO FINAL FRAME)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#050505] overflow-hidden">
        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                Our Approach
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase"
            >
              From First Idea <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] font-serif italic lowercase tracking-normal">
                to final frame.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-white/50 text-sm font-light"
            >
              A collaborative 4-stage framework engineered for clarity and cinematic momentum.
            </motion.p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            
            {[
              {
                num: "01",
                title: "Understand",
                desc: "We start by learning about your goals, your audience, and the story you want to tell.",
                icon: Search,
                phase: "Discovery & Strategy"
              },
              {
                num: "02",
                title: "Create",
                desc: "We shape the concept, plan the production, and bring the right creative direction to the project.",
                icon: Palette,
                phase: "Concept & Planning"
              },
              {
                num: "03",
                title: "Capture",
                desc: "Our team gets to work, capturing the moments, details, and visuals that bring the idea to life.",
                icon: Camera,
                phase: "Production & Shoot"
              },
              {
                num: "04",
                title: "Deliver",
                desc: "We refine the footage and imagery into purposeful content designed around your project’s needs.",
                icon: Film,
                phase: "Post-Production"
              }
            ].map((step, idx) => {
              const StepIcon = step.icon
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE }}
                  className="rounded-2xl p-6 md:p-7 bg-[#0a0a0a] border border-white/10 hover:border-[#C3143D]/50 transition-all duration-500 group flex flex-col justify-between relative min-h-[260px] shadow-lg hover:shadow-[0_15px_40px_rgba(195,20,61,0.15)]"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                        <StepIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[#C3143D] font-sora font-extrabold text-lg tracking-wider">
                        {step.num}
                      </span>
                    </div>

                    <span className="text-white/40 text-[10px] font-bold tracking-[0.25em] uppercase block mb-1.5">
                      {step.phase}
                    </span>

                    <h3 className="text-xl font-sora font-bold text-white mb-2 tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-medium text-white/40 group-hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                    <span>{`Phase ${step.num} Execution`}</span>
                  </div>
                </motion.div>
              )
            })}

          </div>
        </div>
      </section>

      {/* =========================================
          7. WHO WE WORK WITH (PARTNERSHIPS)
          ========================================= */}
      <section className="relative z-10 py-16 md:py-24 bg-[#080808] border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C3143D]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-12">
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-8 h-[2px] bg-[#C3143D]" />
                <span className="text-[#C3143D] text-xs font-bold tracking-[0.3em] uppercase">
                  Partnerships
                </span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase leading-[1.15]"
              >
                Who We <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] font-serif italic lowercase tracking-normal">
                  work with.
                </span>
              </motion.h2>
            </div>

            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3 text-white/70 text-sm md:text-base font-light leading-relaxed"
              >
                <p className="text-white text-base md:text-lg font-normal leading-snug">
                  We collaborate with brands, businesses, startups, event organizers, and teams looking to communicate their ideas through compelling visual content.
                </p>
                <p className="text-white/60">
                  From a one-time event to an ongoing content partnership, we approach every collaboration with the same goal: <span className="text-white font-medium">create work that represents you at your best.</span>
                </p>
              </motion.div>
            </div>
          </div>

          {/* 4 Audience Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              {
                icon: Calendar,
                title: "Event Organizers",
                desc: "Concerts, festivals, and cultural gatherings documented with visceral energy and crowd excitement."
              },
              {
                icon: Briefcase,
                title: "Brands & Businesses",
                desc: "High-production commercial campaigns, brand films, and visual assets that inspire customer loyalty."
              },
              {
                icon: Rocket,
                title: "Startups & Emerging Teams",
                desc: "Dynamic launch videos, product stories, and visionary content that attracts investors and users."
              },
              {
                icon: Mic2,
                title: "Artists & Performers",
                desc: "Cinematic music videos, live show recaps, and artist identity content that stands out in the industry."
              }
            ].map((collab, i) => {
              const CollabIcon = collab.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className="rounded-2xl p-6 bg-[#0f0f0f] border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#C3143D] transition-all">
                    <CollabIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-sora font-bold text-white mb-1.5">{collab.title}</h3>
                  <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">{collab.desc}</p>
                </motion.div>
              )
            })}
          </div>

        </div>
      </section>

      {/* =========================================
          8. FINAL CTA (LET'S MAKE IT REAL)
          ========================================= */}
      <section className="relative z-10 py-20 md:py-28 w-full border-t border-white/10 overflow-hidden flex flex-col items-center justify-center bg-[#050505]">
        {/* Ambient Red Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C3143D]/20 blur-[160px] rounded-full pointer-events-none z-0" />

        <div className="max-w-[850px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6 shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" />
            <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
              Start The Conversation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sora font-black text-white uppercase tracking-tight leading-[1.1]"
          >
            Got A Vision? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] font-serif italic lowercase tracking-normal">
              let’s make it real.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-5 text-white/70 text-sm sm:text-base md:text-lg max-w-lg font-light leading-relaxed"
          >
            Have an event to cover, a campaign to produce, or an idea ready to take shape? Let’s talk about what we can create together.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3.5"
          >
            <Link 
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 md:px-9 md:py-3.5 bg-[#C3143D] text-white rounded-full font-semibold uppercase tracking-widest text-xs md:text-sm shadow-[0_0_35px_rgba(195,20,61,0.5)] hover:shadow-[0_0_55px_rgba(195,20,61,0.7)] hover:scale-105 transition-all duration-300"
            >
              <span>Start a Project</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 md:px-9 md:py-3.5 bg-white/[0.04] hover:bg-white/10 text-white border border-white/15 rounded-full font-semibold uppercase tracking-widest text-xs md:text-sm hover:border-white/30 transition-all duration-300"
            >
              <span>Explore Portfolio</span>
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  )
}
