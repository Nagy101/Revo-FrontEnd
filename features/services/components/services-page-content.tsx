"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { 
  ArrowUpRight, 
  Sparkles, 
  Play, 
  ArrowDown, 
  Flame, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useServices } from "../hooks/useServices"
import type { ServiceItem } from "../types"
import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"
import { useLanguage } from "@/lib/i18n/language-context"

const EASE = [0.16, 1, 0.3, 1] as const

// Local fallback photos for items that have placeholder URLs
const FALLBACK_IMAGES = [
  "/images/revo-services-card1.jpg",
  "/images/revo-services-card2.jpg",
  "/images/revo-singer.jpg",
  "/images/revo-band.jpg",
  "/images/revo-portfolio-card1.jpg",
  "/images/revo-portfolio-card2.jpg",
  "/images/revo-hero-bg.jpg",
]

function getServiceImage(url: string | undefined, index: number): string {
  if (!url || url.includes("placehold.co") || url.trim() === "") {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }
  return url
}

// Fallback services in case backend is unreachable during SSR or network issue
const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: "fb-1",
    nameEn: "Live Stage & Concert Production",
    nameAr: "إنتاج الحفلات والمسارح اللايف",
    descriptionEn: "Multi-camera live directing, stadium-scale stage lighting, crowd coverage, and high-energy live visuals.",
    descriptionAr: "إخراج حفلات لايف بعدسات وكاميرات سينمائية وتغطية جماهيرية ضخمة.",
    imageUrl: "/images/revo-services-card1.jpg",
    orderIndex: 1
  },
  {
    id: "fb-2",
    nameEn: "Mega Events & Stadium Coverage",
    nameAr: "تغطية الاستادات والفعاليات الكبرى",
    descriptionEn: "Colossal festival and stadium productions, synchronized sound capture, high-altitude drone tracking, and recap films.",
    descriptionAr: "إنتاج وتغطية مهرجانات واستادات ضخمة مع طائرات درون وصوت مسرحي متزامن.",
    imageUrl: "/images/revo-services-card2.jpg",
    orderIndex: 2
  },
  {
    id: "fb-3",
    nameEn: "Commercial Campaigns & Brand Films",
    nameAr: "حملات إعلانية وأفلام العلامات التجارية",
    descriptionEn: "High-impact TV commercials, brand anthems, and cinematic storytelling crafted for forward-thinking brands.",
    descriptionAr: "إعلانات تلفزيونية وقصص سينمائية مصممة لرفع قيمة البراند.",
    imageUrl: "/images/revo-singer.jpg",
    orderIndex: 3
  },
  {
    id: "fb-4",
    nameEn: "Cinematic Filmmaking & Music Videos",
    nameAr: "فيديو كليب وأفلام سينمائية",
    descriptionEn: "Narrative music videos, artist profiles, and signature visual pieces that command attention and define culture.",
    descriptionAr: "فيديو كليب وأفلام موسيقية ذات طابع بصري استثنائي.",
    imageUrl: "/images/revo-band.jpg",
    orderIndex: 4
  },
  {
    id: "fb-5",
    nameEn: "Creative Direction & Visual Identity",
    nameAr: "الإخراج الإبداعي والهوية البصرية",
    descriptionEn: "Concept development, aesthetic direction, storyboard sculpting, and bespoke visual branding.",
    descriptionAr: "تطوير المفاهيم الإبداعية وتحديد الاتجاه الفني للبراند.",
    imageUrl: "/images/revo-portfolio-card1.jpg",
    orderIndex: 5
  },
  {
    id: "fb-6",
    nameEn: "Post-Production, Color & Sound Finishing",
    nameAr: "المونتاج وتلوين السينما وهندسة الصوت",
    descriptionEn: "Master-level DaVinci color grading, dynamic sound design, rhythmic editing, and high-fidelity finishing.",
    descriptionAr: "تلوين داڤينشي احترافي وهندسة صوتية متكاملة لجميع المنصات.",
    imageUrl: "/images/revo-hero-bg.jpg",
    orderIndex: 6
  }
]

/* ─────────────────────────────────────────────────────────
   HERO SECTION: 100vh Screen-Fit, User Copy, Exact Background
   ───────────────────────────────────────────────────────── */
function ServicesHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { isArabic } = useLanguage()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
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
  const spotlightX = useTransform(smoothPixelX, (x) => x - 800)
  const spotlightY = useTransform(smoothPixelY, (y) => y - 800)

  const handleScrollDown = () => {
    const nextSection = document.getElementById("all-services")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen pt-16 sm:pt-20 md:pt-20 pb-6 md:pb-0 flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── BASE BACKGROUND (Matches Home & About Exactly) ── */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0 origin-top will-change-transform"
      >
        <img
          src="/images/revo-hero-bg.jpg"
          alt="REVO Services Background"
          className="w-full h-full object-cover object-bottom opacity-85"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/60" />
      </motion.div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          className="fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
          style={{
            background: "radial-gradient(circle, rgba(195, 20, 61, 0.15) 0%, transparent 60%)",
            x: spotlightX,
            y: spotlightY,
          }}
        />
      )}

      {/* ── NOISE OVERLAY ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("/images/noise.png")' }}
      />

      {/* ── MAIN CONTENT (Calibrated to fit 100vh screen exactly like Home & About) ── */}
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
            <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" /> {isArabic ? "إنتاج إعلامي متكامل" : "Full-Spectrum Media Production"}
          </span>
          <div className="w-8 md:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
        </motion.div>

        {/* Main Title Group (User's Exact Headline: BIG IDEAS DESERVE GREAT PRODUCTION.) */}
        <div className="flex flex-col items-center text-center">
          <div className="overflow-hidden pb-1">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-sora font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-2xl whitespace-nowrap"
            >
              {isArabic ? "أفكارك العظيمة تستحق" : "Big Ideas Deserve"}
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
                {isArabic ? "إنتاجاً استثنائياً." : "Great Production."}
              </h1>
              <h1 className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif italic leading-[1.05] text-[#C3143D] opacity-25 blur-2xl pointer-events-none">
                {isArabic ? "إنتاجاً استثنائياً." : "Great Production."}
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

        {/* Lead Copy (User's Exact Text: From live events to brand campaigns...) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="max-w-xl text-center text-white/90 text-xs sm:text-sm font-light mt-2.5 md:mt-3.5 leading-relaxed [text-shadow:_0_1px_12px_rgba(0,0,0,0.8)]"
        >
          {isArabic
            ? "من الفعاليات الحية إلى الحملات الإعلانية، نصنع محتوى بصري وسينمائي يخطف الأنظار، ويروي القصص، ويضع أفكارك في الصدارة التي تستحقها."
            : "From live events to brand campaigns, we create photo and video content that captures attention, tells stories, and gives your ideas the spotlight they deserve."}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="flex flex-row items-center gap-3.5 md:gap-4 mt-4 md:mt-5"
        >
          <button
            onClick={handleScrollDown}
            className="group relative px-6 py-2.5 md:px-7 md:py-3 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm shadow-[0_0_25px_rgba(195,20,61,0.4)] hover:shadow-[0_0_45px_rgba(195,20,61,0.6)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-cinematic" />
            <span className="relative flex items-center gap-2">
              {isArabic ? "استكشف الخدمات" : "Explore Services"}{" "}
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <Link
            href="/contact"
            className="group px-6 py-2.5 md:px-7 md:py-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
          >
            {isArabic ? "تواصل معنا" : "Let’s Talk"} <ArrowUpRight size={14} className="ml-1 rtl:rotate-180" />
          </Link>
        </motion.div>

        {/* ── CINEMATIC CONCERT CARDS DUO (16:10 IMAGES PROVIDED BY USER) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
          className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-5 sm:mt-6 w-full max-w-2xl mx-auto z-20"
        >
          {/* Card 1: Live Stage Concert Production */}
          <Link href="/portfolio" className="flex-1 max-w-[270px]">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative w-full aspect-[16/10] rounded-2xl p-1.5 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer -rotate-1 hover:rotate-0"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src="/images/revo-services-card1.jpg"
                  alt="Live Concert Production"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Soft bottom shadow only - leaves performers 100% clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Clean Bottom Label */}
                <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <p className="text-[11px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {isArabic ? "المسارح والإضاءة" : "Stage & Beams"}
                  </p>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                    <Play size={7} className="fill-current text-white translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 2: Mega Stadium Experience */}
          <Link href="/portfolio" className="flex-1 max-w-[270px]">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative w-full aspect-[16/10] rounded-2xl p-1.5 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 cursor-pointer rotate-1 hover:rotate-0"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src="/images/revo-services-card2.jpg"
                  alt="Stadium Production"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Soft bottom shadow only - leaves performers 100% clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Clean Bottom Label */}
                <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <p className="text-[11px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {isArabic ? "عروض الاستادات" : "Stadium Visuals"}
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
            <path id="circlePathServices" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
            <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
              <textPath href="#circlePathServices" startOffset="0%">
                ★ REVO PRODUCTION SERVICES ★ CREATIVE EXCELLENCE
              </textPath>
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

/* ─────────────────────────────────────────────────────────
   MAIN SERVICES CONTENT COMPONENT (DIRECT DATABASE INTEGRATION)
   ───────────────────────────────────────────────────────── */
export function ServicesPageContent() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 6
  const { isArabic } = useLanguage()

  // Fetch directly from database with pageIndex and pageSize=6
  const { data: response, isLoading, isError } = useServices(currentPage, itemsPerPage)

  // Extract database items
  const dbServices: ServiceItem[] = response?.data?.data || []
  const totalCount = response?.data?.totalCount ?? (dbServices.length > 0 ? dbServices.length : FALLBACK_SERVICES.length)
  const totalPages = response?.data?.totalPages || Math.max(1, Math.ceil(totalCount / itemsPerPage))

  // Use database data when available, otherwise gentle fallback
  const displayServices: ServiceItem[] = (dbServices && dbServices.length > 0)
    ? dbServices
    : (isError || (!isLoading && dbServices.length === 0))
      ? FALLBACK_SERVICES
      : []

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
    const target = document.getElementById("all-services")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative z-10 bg-[#050505] min-h-screen">
      {/* ── SERVICES HERO ── */}
      <ServicesHero />

      {/* ── KINETIC MARQUEE RIBBON ── */}
      <div className="relative py-4 bg-[#080808] border-y border-white/10 overflow-hidden select-none z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
        <motion.div
          animate={{ x: isArabic ? [0, 1200] : [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex items-center gap-8 whitespace-nowrap text-xs md:text-sm font-sora font-extrabold uppercase tracking-[0.3em] text-white/40"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="text-white">{isArabic ? "إخراج الحفلات والمسارح" : "Live Stage Directing"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
              <span className="text-white/80">{isArabic ? "إعلانات سينمائية" : "Cinematic Commercials"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
              <span className="text-white">{isArabic ? "شاشات واستادات" : "Stadium Visuals"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
              <span className="text-white/80">{isArabic ? "تصوير متعدد الكاميرات" : "Multi-Camera Rigging"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
              <span className="text-[#C3143D] font-bold">{isArabic ? "منظومة إنتاج ريفو" : "REVO Production Suite"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── CORE CAPABILITIES SECTION HEADER ── */}
      <div id="all-services" className="max-w-[1300px] mx-auto px-6 pt-20 pb-10 relative z-10 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3">
              <Flame className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                {isArabic ? "القدرات الرئيسية" : "Core Capabilities"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase">
              {isArabic ? (
                <>
                  ترسانتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">الإبداعية.</span>
                </>
              ) : (
                <>
                  Our Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">Arsenal.</span>
                </>
              )}
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-sm font-light leading-relaxed">
            {isArabic
              ? "إنتاج إعلامي وسينمائي شامل مصمم لإبهار الجماهير، والارتقاء بالعلامات التجارية، وتقديم أعلى درجات التميز السينمائي."
              : "Full-spectrum media production engineered to captivate audiences, elevate brands, and deliver cinematic excellence."}
          </p>
        </motion.div>
      </div>

      {/* ── SERVICES GRID (DATABASE POWERED • 6 PER PAGE) ── */}
      <div className="max-w-[1300px] mx-auto px-6 pb-12">
        {isLoading && displayServices.length === 0 ? (
          // Elegant Shimmer Skeleton Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative rounded-2xl md:rounded-[1.75rem] overflow-hidden aspect-[4/5] sm:aspect-[3/4] border border-white/5 bg-[#0c0c0c] p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="w-20 h-5 bg-white/10 rounded-full" />
                <div className="space-y-3">
                  <div className="w-3/4 h-7 bg-white/10 rounded-lg" />
                  <div className="w-full h-4 bg-white/5 rounded" />
                  <div className="w-2/3 h-4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <OptimizedGSAPSection
            key={`page-${currentPage}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
            animationType="stagger"
            threshold={0.1}
          >
            {displayServices.map((service, index) => {
              const absoluteIndex = (currentPage - 1) * itemsPerPage + index
              const imageSrc = getServiceImage(service.imageUrl, absoluteIndex)
              const title = (
                isArabic
                  ? service.nameAr || service.nameEn || "خدمة إنتاجية"
                  : service.nameEn || service.nameAr || "Production Service"
              ).trim()
              const description = (
                isArabic
                  ? service.descriptionAr || service.descriptionEn || ""
                  : service.descriptionEn || service.descriptionAr || ""
              ).trim()

              return (
                <Link
                  key={service.id || index}
                  href={`/services/${service.id}`}
                  className="block h-full group"
                >
                  <motion.div
                    data-animate
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="relative rounded-2xl md:rounded-[1.75rem] overflow-hidden aspect-[4/5] sm:aspect-[3/4] border border-white/10 hover:border-[#C3143D]/60 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_50px_rgba(195,20,61,0.25)] bg-[#0c0c0c] cursor-pointer h-full flex flex-col justify-between p-6"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#C3143D]/25 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Top Bar: Badge & Number */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold tracking-widest uppercase">
                        {isArabic ? "إنتاج ريفو" : "REVO Production"}
                      </div>
                      <span className="text-white/30 font-sora font-extrabold text-sm tracking-wider group-hover:text-white/70 transition-colors">
                        {String(absoluteIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Bottom Content Area */}
                    <div className="relative z-10 mt-auto pt-8">
                      <h3 className="text-xl md:text-2xl font-sora font-extrabold text-white tracking-tight group-hover:text-red-100 transition-colors drop-shadow-md">
                        {title}
                      </h3>

                      {description && (
                        <p className="text-white/70 text-xs font-light leading-relaxed mt-2 line-clamp-2">
                          {description}
                        </p>
                      )}

                      {/* Action Link Pill */}
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C3143D] group-hover:text-red-300 transition-colors">
                          {isArabic ? "استكشف الخدمة" : "Explore Service"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-[#C3143D] flex items-center justify-center transition-colors">
                          <ArrowUpRight size={14} className="text-white group-hover:rotate-45 rtl:group-hover:-rotate-45 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Light Sheen Streak */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 pointer-events-none" />
                  </motion.div>
                </Link>
              )
            })}
          </OptimizedGSAPSection>
        )}
      </div>

      {/* ── PAGINATION BAR (ACTIVATES WHEN MORE THAN 6 CARDS EXIST) ── */}
      {totalPages > 1 && (
        <div className="max-w-[1300px] mx-auto px-6 pb-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
          <div className="text-xs text-white/40 tracking-wider uppercase font-semibold">
            {isArabic ? (
              <>
                صفحة <span className="text-white font-bold">{currentPage}</span> من{" "}
                <span className="text-white font-bold">{totalPages}</span> — إجمالي{" "}
                <span className="text-white font-bold">{totalCount}</span> خدمة
              </>
            ) : (
              <>
                Page <span className="text-white font-bold">{currentPage}</span> of{" "}
                <span className="text-white font-bold">{totalPages}</span> — Total{" "}
                <span className="text-white font-bold">{totalCount}</span> Services
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                currentPage === 1
                  ? "bg-white/[0.02] text-white/20 cursor-not-allowed border border-white/5"
                  : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10 cursor-pointer"
              }`}
            >
              <ChevronLeft size={14} className="rtl:rotate-180" /> {isArabic ? "السابق" : "Previous"}
            </button>

            {/* Page Number Pills */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1
              const isActive = currentPage === pageNumber
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-full text-xs font-bold font-sora transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "bg-[#C3143D] text-white shadow-[0_0_20px_rgba(195,20,61,0.6)] scale-105"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {String(pageNumber).padStart(2, "0")}
                </button>
              )
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-white/[0.02] text-white/20 cursor-not-allowed border border-white/5"
                  : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10 cursor-pointer"
              }`}
            >
              {isArabic ? "التالي" : "Next"} <ChevronRight size={14} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
