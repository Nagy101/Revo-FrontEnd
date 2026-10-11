"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Share2, 
  Check, 
  X, 
  Maximize2, 
  Play, 
  Sparkles, 
  Video, 
  Sliders, 
  ShieldCheck, 
  Camera, 
  Layers 
} from "lucide-react"
import { usePortfolioDetails, usePublicPortfolios } from "../hooks/usePortfolios"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { DeferredVimeoPlayer } from "@/components/ui/deferred-vimeo-player"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"

interface PortfolioDetailContentProps {
  slug: string
}

const EASE = [0.16, 1, 0.3, 1] as const

export function PortfolioDetailContent({ slug }: PortfolioDetailContentProps) {
  const router = useRouter()
  const { data: response, isLoading, isError } = usePortfolioDetails(slug)
  const { data: allPortfolios = [] } = usePublicPortfolios()
  const portfolio = response?.data
  const { isArabic } = useLanguage()

  const [isMounted, setIsMounted] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: "image" | "video"; title?: string } | null>(null)

  useEffect(() => {
    setIsMounted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [slug])

  useEffect(() => {
    if (isError) {
      router.push("/404")
    }
  }, [isError, router])

  // Escape key for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMedia(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Mouse spotlight tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share) {
          await navigator.share({
            title: portfolio?.captionEn || "Project by REVO",
            url: window.location.href,
          })
        } else {
          await navigator.clipboard.writeText(window.location.href)
          setIsShared(true)
          setTimeout(() => setIsShared(false), 2000)
        }
      }
    } catch {
      // ignore
    }
  }

  // Media calculations
  const mediaItems = portfolio?.mediaItems || []
  const allImages = mediaItems.filter((m: any) => m.type !== 2)
  const allVideos = mediaItems.filter((m: any) => m.type === 2)

  // Primary media
  const heroMedia = mediaItems[0] || null
  const heroIsVideo = heroMedia?.type === 2
  const heroImageSrc = heroMedia?.coverImageUrl || heroMedia?.mediaUrl || "/images/revo-hero-bg.jpg"

  // Additional media beyond the first
  const additionalMedia = mediaItems.slice(1)

  // Next / Previous projects
  const currentIndex = allPortfolios.findIndex((p) => p.id === slug)
  const nextProject =
    currentIndex !== -1 && currentIndex < allPortfolios.length - 1
      ? allPortfolios[currentIndex + 1]
      : allPortfolios.length > 0 && currentIndex !== 0
      ? allPortfolios[0]
      : null
  const prevProject = currentIndex > 0 ? allPortfolios[currentIndex - 1] : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="relative w-12 h-12 flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-[#C3143D] rounded-full animate-spin" />
          <Sparkles className="w-4 h-4 text-[#C3143D] absolute" />
        </div>
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-sora font-semibold">
          {isArabic ? "جاري تحميل المشروع..." : "Loading Project..."}
        </p>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#C3143D]">
          <Layers size={24} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-sora font-extrabold mb-3">
          {isArabic ? "لم يتم العثور على المشروع" : "Project Not Found"}
        </h1>
        <p className="text-white/50 text-sm max-w-md mb-8 leading-relaxed">
          {isArabic
            ? "عذراً، لم نتمكن من العثور على المشروع المطلوب أو قد تم أرشفته."
            : "The requested portfolio item could not be found or has been archived."}
        </p>
        <Link
          href="/portfolio"
          className="px-6 py-3 rounded-full bg-[#C3143D] hover:bg-white hover:text-black text-white font-semibold uppercase tracking-wider text-xs transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} className="rtl:rotate-180" /> {isArabic ? "العودة إلى المعرض" : "Back To Portfolio"}
        </Link>
      </div>
    )
  }

  const categoryName = (
    isArabic
      ? portfolio.categoryNameAr || portfolio.categoryNameEn || "إنتاج إعلامي"
      : portfolio.categoryNameEn || portfolio.categoryNameAr || "Media Production"
  ).trim()
  const projectTitle = (
    isArabic
      ? portfolio.captionAr || portfolio.captionEn || "عمل فني مميز"
      : portfolio.captionEn || portfolio.captionAr || "Signature Masterpiece"
  ).trim()

  return (
    <div className="relative bg-[#050505] min-h-screen selection:bg-[#C3143D] selection:text-white pb-28 overflow-x-hidden">
      {/* ── CINEMATIC AMBIENT BACKDROP ── */}
      <div className="absolute top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-none z-0">
        <img
          src={heroImageSrc}
          alt={projectTitle}
          className="w-full h-full object-cover opacity-15 filter blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]" />
      </div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
          className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[220px] pointer-events-none z-0"
        />
      )}

      {/* ── LIGHTBOX OVERLAY ── */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-[#C3143D] hover:text-white transition-all z-[130] cursor-pointer border border-white/10"
              onClick={() => setSelectedMedia(null)}
            >
              <X size={20} />
            </button>

            {selectedMedia.type === "image" ? (
              <motion.img
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                src={selectedMedia.url}
                alt={selectedMedia.title || projectTitle}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl cursor-default shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="w-full max-w-5xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl cursor-default border border-white/10 bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <DeferredVimeoPlayer
                  videoId={selectedMedia.url}
                  title={selectedMedia.title || projectTitle}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP BREADCRUMB ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 sm:pt-32 pb-4 flex items-center justify-between border-b border-white/5">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
          <span>{isArabic ? "جميع المشاريع" : "All Projects"}</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D] animate-pulse" />
            {categoryName}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {isShared ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">{isArabic ? "تم النسخ" : "Copied"}</span>
              </>
            ) : (
              <>
                <Share2 size={12} />
                <span>{isArabic ? "مشاركة" : "Share"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── HEADER TITLE & LEAD ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C3143D]/10 border border-[#C3143D]/30 text-[#C3143D] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles size={11} />
            {isArabic ? "تفاصيل المشروع" : "Case Study"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold uppercase text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {projectTitle}
          </h1>

          <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            {isArabic
              ? "إنتاج سينمائي مميز نُفذ بأعلى درجات الدقة الإخراجية والهندسة البصرية بواسطة ريفو."
              : "A signature production crafted with cinematic precision, bespoke direction, and broadcast-grade media finishing by REVO."}
          </p>
        </motion.div>
      </div>

      {/* ── MAIN STAGE: CINEMA SHOWCASE & PROJECT INFO SUITE SIDE-BY-SIDE ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT: PRIMARY CINEMA SHOWCASE (16:10) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-[#0c0c0c] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group"
            >
              {heroMedia ? (
                heroIsVideo ? (
                  <div className="w-full h-full bg-black">
                    <DeferredVimeoPlayer
                      videoId={heroMedia.mediaUrl || ""}
                      title={projectTitle}
                      thumbnailUrl={heroMedia.coverImageUrl || undefined}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-full relative cursor-zoom-in overflow-hidden"
                    onClick={() => {
                      if (heroMedia.mediaUrl) {
                        setSelectedMedia({
                          url: heroMedia.mediaUrl,
                          type: "image",
                          title: projectTitle,
                        })
                      }
                    }}
                  >
                    <CloudinaryImage
                      src={heroMedia.mediaUrl || "/images/revo-hero-bg.jpg"}
                      alt={projectTitle}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Bottom Label */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                      <span className="text-xs font-bold tracking-wider text-white/90 uppercase truncate max-w-[70%]">
                        {projectTitle}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shrink-0">
                        {isArabic ? "المشهد الرئيسي" : "Primary Visual"}
                      </span>
                    </div>

                    {/* Hover expand hint */}
                    <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-widest">
                  {isArabic ? "لا توجد وسائط متوفرة" : "No Media Available"}
                </div>
              )}
            </motion.div>

            {/* Clean Feature Line */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/70">
              <div className="flex items-center justify-center gap-1.5">
                <Video size={13} className="text-[#C3143D]" />
                <span>{isArabic ? "سينمائي 4K" : "Cinematic 4K"}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 border-x border-white/5">
                <Sliders size={13} className="text-[#C3143D]" />
                <span>{isArabic ? "تلوين سينمائي" : "Color Grading"}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-[#C3143D]" />
                <span>{isArabic ? "ماستر ريفو" : "REVO Master"}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: LUXURY PROJECT SPECS & ACTION CARD (5 COLS) ── */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#121212]/95 to-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(195,20,61,0.1)] overflow-hidden"
            >
              {/* Subtle top accent hairline */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C3143D]/70 to-transparent" />

              {/* Clean Card Header */}
              <div className="mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C3143D]">
                    {isArabic ? "مواصفات الإنتاج" : "Project Specifications"}
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/40">
                    REF-0{portfolio.orderIndex || 1}
                  </span>
                </div>
                <h3 className="text-xl font-sora font-extrabold text-white tracking-tight">
                  {isArabic ? "نظرة عامة والمخرجات" : "Overview & Deliverables"}
                </h3>
              </div>

              {/* Metadata Rows */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    {isArabic ? "التصنيف" : "Category"}
                  </span>
                  <span className="text-white font-bold tracking-wide">
                    {categoryName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    {isArabic ? "التنفيذ" : "Execution"}
                  </span>
                  <span className="text-white font-medium">
                    {isArabic ? "إنتاج سينمائي شامل" : "Full-Spectrum Production"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    {isArabic ? "المخرجات" : "Deliverables"}
                  </span>
                  <span className="text-white font-medium">
                    {allVideos.length > 0 && `${allVideos.length} ${isArabic ? "أفلام" : "Films"}`}
                    {allVideos.length > 0 && allImages.length > 0 && " · "}
                    {allImages.length > 0 && `${allImages.length} ${isArabic ? "صور فائقة الدقة" : "High-Res"}`}
                    {mediaItems.length === 0 && (isArabic ? "1 مشهد ماستر" : "1 Master Visual")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    {isArabic ? "الاستوديو" : "Studio"}
                  </span>
                  <span className="text-[#C3143D] font-bold">
                    {isArabic ? "استوديو ريفو الإبداعي" : "REVO Creative Studio"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/services"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C3143D] to-[#990d2e] hover:from-[#d61745] hover:to-[#b00f35] text-white font-sora font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(195,20,61,0.4)] cursor-pointer"
                >
                  <span>{isArabic ? "احجز إنتاجاً مماثلاً" : "Book Similar Production"}</span>
                  <ArrowUpRight size={14} className="rtl:rotate-180" />
                </Link>

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-sora font-semibold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>
                    {isShared
                      ? (isArabic ? "تم نسخ الرابط للحافظة" : "Link Copied to Clipboard")
                      : (isArabic ? "شارك هذا المشروع" : "Share This Project")}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── ADDITIONAL GALLERY ASSETS (IF MORE MEDIA ITEMS EXIST) ── */}
      {additionalMedia.length > 0 && (
        <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#C3143D] mb-2">
                <Camera size={11} />
                {isArabic ? "معرض الملحقات" : "Asset Gallery"}
              </div>
              <h3 className="text-xl sm:text-2xl font-sora font-extrabold uppercase text-white tracking-tight">
                {isArabic ? `وسائط إضافية (${additionalMedia.length})` : `Additional Media (${additionalMedia.length})`}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {additionalMedia.map((item: any, idx: number) => {
              const isVid = item.type === 2
              const coverUrl = item.coverImageUrl || item.mediaUrl || "/images/revo-hero-bg.jpg"
              return (
                <div
                  key={item.id || idx}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0c0c0c] border border-white/10 hover:border-[#C3143D]/50 transition-all duration-300 group cursor-pointer shadow-lg"
                  onClick={() => {
                    setSelectedMedia({
                      url: item.mediaUrl,
                      type: isVid ? "video" : "image",
                      title: `${projectTitle} — Asset ${idx + 2}`,
                    })
                  }}
                >
                  <CloudinaryImage
                    src={coverUrl}
                    alt={`${projectTitle} asset ${idx + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play or Expand Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isVid ? (
                      <div className="w-12 h-12 rounded-full bg-[#C3143D] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={16} className="fill-current translate-x-0.5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={14} />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 font-sora font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
                      {isVid ? (isArabic ? "فيديو" : "Film Reel") : (isArabic ? "صورة فوتوغرافية" : "Still Capture")}
                    </span>
                    <span className="font-mono text-white/40">
                      #{String(idx + 2).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── FOOTER NAVIGATOR (NEXT / PREV CASE STUDY) ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 border-t border-white/10 flex items-center justify-between">
        {prevProject ? (
          <Link
            href={`/portfolio/${prevProject.id}`}
            className="group flex items-center gap-3 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
            <span className="font-sora font-semibold">
              {isArabic
                ? `السابق: ${prevProject.captionAr || prevProject.captionEn}`
                : `Previous: ${prevProject.captionEn || prevProject.captionAr}`}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            href={`/portfolio/${nextProject.id}`}
            className="group flex items-center gap-3 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors ml-auto"
          >
            <span className="font-sora font-semibold">
              {isArabic
                ? `التالي: ${nextProject.captionAr || nextProject.captionEn}`
                : `Next: ${nextProject.captionEn || nextProject.captionAr}`}
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  )
}
