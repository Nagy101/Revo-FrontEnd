"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, Video } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isArabic } = useLanguage()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax subtle motion for section feel
  const bgGlowY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  
  // Staggered reveal variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any } }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  // Real, authentic production capabilities instead of fake numerical stats
  const pillars = [
    {
      step: "01",
      tag: isArabic ? "الرؤية والفكرة" : "Vision & Concept",
      title: isArabic ? "قبل أول لقطة" : "Before The First Roll",
      desc: isArabic
        ? "يبدأ كل مشروع بقصة بصرية وسيناريو متكامل مصمم لجعل علامتك التجارية أو فنانك لا يُنسى."
        : "Every production begins with a distinct narrative and visual storyboard designed to make your brand or artist unforgettable."
    },
    {
      step: "02",
      tag: isArabic ? "طاقم العمل" : "On-Set Crew",
      title: isArabic ? "قوة سينمائية خارقة" : "Cinema-Grade Power",
      desc: isArabic
        ? "إخراج متعدد الكاميرات، وعدسات سينمائية فائقة السرعة، وطيارو درون FPV لالتقاط الطاقة الحية للمدرجات."
        : "Multi-camera directing, high-speed cinema optics, and FPV drone pilots engineered to capture the raw energy of stadium crowds."
    },
    {
      step: "03",
      tag: isArabic ? "ما بعد الإنتاج" : "Post-Production",
      title: isArabic ? "كيمياء الصوت والألوان" : "Sound & Color Alchemy",
      desc: isArabic
        ? "تلوين سينمائي دقيق، وإيقاع مونتاج ديناميكي، وهندسة صوتية محيطية تحول المشاهد الخام إلى تحفة حسية."
        : "Surgical color grading, dynamic pacing, and immersive sound engineering that turn raw footage into a sensory masterpiece."
    }
  ]

  return (
    <section ref={containerRef} className="pt-12 md:pt-24 pb-32 md:pb-44 bg-[#050505] relative overflow-hidden">
      
      {/* ── AMBIENT GLOW ── */}
      <motion.div 
        style={{ y: bgGlowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(195,20,61,0.07)_0%,transparent_70%)] pointer-events-none" 
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* ── MANIFESTO HEADER ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-10 md:w-14 h-px bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span className="flex items-center gap-2 text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5" /> {isArabic ? "البيان الإبداعي" : "The Manifesto"}
            </span>
            <div className="w-10 md:w-14 h-px bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>
          
          <div className="text-4xl md:text-6xl lg:text-[5.5rem] font-sora font-light uppercase text-white/95 leading-[1.08] mb-8 md:mb-10 tracking-tight flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block">
                {isArabic ? "نحن لا نوثق اللحظات فحسب." : "We don't just capture moments."}
              </motion.span>
            </div>
            <div className="overflow-hidden mt-2 md:mt-4">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] pr-4">
                {isArabic ? "بل نصنع" : "We engineer"}
              </motion.span>
            </div>
            <div className="overflow-hidden mt-2 md:mt-4">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block">
                {isArabic ? "قصصاً سينمائية." : "cinematic stories."}
              </motion.span>
            </div>
          </div>

          <motion.p variants={itemVariants} className="text-white/60 text-sm sm:text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-16 md:mb-20">
            {isArabic
              ? "REVO هي منظومة إبداعية متكاملة من المخرجين وصناع القصص البصرية. نحمل الرؤية وفريق العمل والطاقة لتحويل مدرجات الملاعب والفعاليات الكبرى والحملات الإعلانية إلى لحظات بصرية خالدة."
              : "REVO is a powerhouse of visual storytellers, directors, and creators. We bring the vision, the crew, and the energy to turn live stadiums, high-stakes events, and commercial campaigns into unforgettable visual moments."}
          </motion.p>
        </motion.div>

        {/* ── CINEMATIC REVO X DISCO MISR VIDEO PLAYER ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
          onClick={togglePlay}
          className="group relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-black border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(195,20,61,0.15)] cursor-pointer select-none"
        >
          {/* HTML5 Native Video Tag */}
          <video
            ref={videoRef}
            playsInline
            preload="metadata"
            loop
            poster="/images/revo-hero-bg.jpg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          >
            <source src="/videos/revo-disco-misr.mov" type="video/mp4" />
            <source src="/videos/revo-disco-misr.mov" type="video/quicktime" />
          </video>

          {/* Vignette / Dark Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2.5 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
              <Film className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                REVO X DISCO MISR
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#C3143D] animate-ping" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90">
                4K Cinema
              </span>
            </div>
          </div>

          {/* Center Play/Pause Indicator (Shows when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-300">
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 rounded-full bg-[#C3143D] blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#C3143D] backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1.5 fill-current" />
                </div>
              </div>
              <span className="mt-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase">
                {isArabic ? "تشغيل شو ريل الإنتاج" : "Play Production Reel"}
              </span>
            </div>
          )}

          {/* Bottom Interactive Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#C3143D] hover:border-[#C3143D] transition-all duration-300"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-current" />}
              </button>
              
              <button 
                onClick={toggleMute}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-white/60 font-medium">
                {isArabic ? "تغطية الحفلات الحية" : "Live Concert Coverage"}
              </span>
              <button 
                onClick={handleFullscreen}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Fullscreen"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── THE 3 CREATIVE PILLARS (AUTHENTIC AGENCY STANDARD) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-20 md:mt-28 pt-16 border-t border-white/10"
        >
          {pillars.map((pillar, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#C3143D]/50 hover:bg-white/[0.04] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[#C3143D] text-xs font-mono font-bold tracking-[0.25em] uppercase">
                    {pillar.step} / {pillar.tag}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#C3143D]/40 group-hover:bg-[#C3143D] group-hover:scale-125 transition-all" />
                </div>
                <h3 className="text-xl sm:text-2xl font-sora font-semibold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-white/50 text-xs sm:text-sm font-light leading-relaxed group-hover:text-white/70 transition-colors">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[#C3143D] text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{isArabic ? "معايير ريفو" : "The REVO Standard"}</span>
                <span className="rtl:rotate-180">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/30">
            {isArabic ? "✦ مصممة للاستادات، والمهرجانات العالمية، وأقوى الحملات الإعلانية ✦" : "✦ BUILT FOR STADIUMS, GLOBAL FESTIVALS & HIGH-IMPACT ADS ✦"}
          </span>
        </motion.div>

      </div>
    </section>
  )
}
