"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  X,
  Maximize2,
  Sparkles,
  Video,
  Sliders,
  ShieldCheck,
  Camera,
  Layers,
  Play,
  Images,
} from "lucide-react"
import { usePortfolioDetails, usePublicPortfolios } from "../hooks/usePortfolios"
import { DeferredVimeoPlayer } from "@/components/ui/deferred-vimeo-player"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

interface PortfolioDetailContentProps {
  slug: string
}

const EASE = [0.16, 1, 0.3, 1] as const

function getOptimizedMediaUrl(url?: string | null, width = 1200): string {
  if (!url || typeof url !== "string") return "/images/revo-hero-bg.jpg"
  if (!url.includes("cloudinary.com")) return url
  const parts = url.split("/upload/")
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/f_auto,q_auto,w_${width}/${parts[1]}`
}

function useResponsiveColumns(itemCount: number): number {
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth
      if (w < 640) {
        setCols(1)
      } else if (w < 1024) {
        setCols(Math.min(2, Math.max(1, itemCount)))
      } else {
        setCols(Math.min(3, Math.max(1, itemCount)))
      }
    }
    updateCols()
    window.addEventListener("resize", updateCols)
    return () => window.removeEventListener("resize", updateCols)
  }, [itemCount])

  return cols
}

export function PortfolioDetailContent({ slug }: PortfolioDetailContentProps) {
  const { data: response, isLoading } = usePortfolioDetails(slug)
  const { data: allPortfolios = [] } = usePublicPortfolios()
  const portfolio = response?.data

  const [isMounted, setIsMounted] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    setIsMounted(true)
    setLightboxIndex(null)
    setAspectRatios({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [slug])

  // Media calculations
  const mediaItems = useMemo(() => portfolio?.mediaItems || [], [portfolio?.mediaItems])
  const allImages = useMemo(() => mediaItems.filter((m: any) => m.type !== 2), [mediaItems])
  const allVideos = useMemo(() => mediaItems.filter((m: any) => m.type === 2), [mediaItems])
  const isAlbum = mediaItems.length > 1

  // Primary media
  const heroMedia = mediaItems[0] || null
  const heroIsVideo = heroMedia?.type === 2
  const heroVideoSrc = heroMedia?.videoUrl || heroMedia?.mediaUrl || ""
  const heroBackdropImage = heroIsVideo
    ? heroMedia?.coverImageUrl || null
    : heroMedia?.coverImageUrl || heroMedia?.mediaUrl || null

  const goPrevMedia = useCallback(() => {
    if (lightboxIndex === null || mediaItems.length === 0) return
    setLightboxIndex((lightboxIndex - 1 + mediaItems.length) % mediaItems.length)
  }, [lightboxIndex, mediaItems.length])

  const goNextMedia = useCallback(() => {
    if (lightboxIndex === null || mediaItems.length === 0) return
    setLightboxIndex((lightboxIndex + 1) % mediaItems.length)
  }, [lightboxIndex, mediaItems.length])

  // Keyboard navigation for gallery lightbox (Esc, Left, Right)
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      else if (e.key === "ArrowLeft") goPrevMedia()
      else if (e.key === "ArrowRight") goNextMedia()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, goPrevMedia, goNextMedia])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxIndex])

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

  const handleImageMeasure = (key: string, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return
    const ratio = img.naturalHeight / img.naturalWidth
    setAspectRatios((prev) => {
      if (prev[key] && Math.abs(prev[key] - ratio) < 0.01) return prev
      return { ...prev, [key]: ratio }
    })
  }

  // Distribute album items into shortest-column masonry buckets based on real aspect ratios
  const columnCount = useResponsiveColumns(mediaItems.length)
  const masonryColumns = useMemo(() => {
    const cols: Array<Array<{ item: any; globalIndex: number; key: string }>> = Array.from(
      { length: columnCount },
      () => []
    )
    const colHeights = Array(columnCount).fill(0)

    mediaItems.forEach((item: any, globalIndex: number) => {
      const key = item.id || `item-${globalIndex}`
      const isVid = item.type === 2
      const estimatedRatio = isVid ? 9 / 16 : aspectRatios[key] || 1

      let shortestCol = 0
      for (let c = 1; c < columnCount; c++) {
        if (colHeights[c] < colHeights[shortestCol]) {
          shortestCol = c
        }
      }

      cols[shortestCol].push({ item, globalIndex, key })
      colHeights[shortestCol] += estimatedRatio + 0.04
    })

    return cols
  }, [mediaItems, columnCount, aspectRatios])

  // Next / Previous projects
  const currentIndex = allPortfolios.findIndex((p: any) => p.id === slug)
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
          Loading Project...
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
          Project Not Found
        </h1>
        <p className="text-white/50 text-sm max-w-md mb-8 leading-relaxed">
          The requested portfolio item could not be found or has been archived.
        </p>
        <Link
          href="/portfolio"
          className="px-6 py-3 rounded-full bg-[#C3143D] hover:bg-white hover:text-black text-white font-semibold uppercase tracking-wider text-xs transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back To Portfolio
        </Link>
      </div>
    )
  }

  const categoryName = (portfolio.categoryNameEn || portfolio.categoryNameAr || "Media Production").trim()
  const projectTitle = (portfolio.captionEn || portfolio.captionAr || "Signature Masterpiece").trim()
  const activeLightboxItem = lightboxIndex !== null ? mediaItems[lightboxIndex] : null
  const activeLightboxIsVideo = activeLightboxItem?.type === 2
  const activeLightboxSrc = activeLightboxIsVideo
    ? activeLightboxItem?.videoUrl || activeLightboxItem?.mediaUrl || ""
    : getOptimizedMediaUrl(activeLightboxItem?.mediaUrl || activeLightboxItem?.coverImageUrl, 1600)

  return (
    <div className="relative bg-[#050505] min-h-screen selection:bg-[#C3143D] selection:text-white pb-28 overflow-x-hidden">
      {/* ── CINEMATIC AMBIENT BACKDROP ── */}
      {heroBackdropImage && (
        <div className="absolute top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-none z-0">
          <img
            src={getOptimizedMediaUrl(heroBackdropImage, 1400)}
            alt={projectTitle}
            className="w-full h-full object-cover opacity-15 filter blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]" />
        </div>
      )}

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
          className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[220px] pointer-events-none z-0"
        />
      )}

      {/* ── INTERACTIVE GALLERY LIGHTBOX OVERLAY ── */}
      <AnimatePresence>
        {lightboxIndex !== null && activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar */}
            <div
              className="relative z-[130] flex items-center justify-between max-w-6xl w-full mx-auto pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-bold text-white shrink-0">
                  {lightboxIndex + 1} / {mediaItems.length}
                </span>
                <span className="text-xs sm:text-sm font-sora font-semibold text-white/80 truncate">
                  {projectTitle}
                </span>
              </div>

              <button
                type="button"
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-[#C3143D] hover:text-white transition-all cursor-pointer border border-white/10 shrink-0"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close gallery"
              >
                <X size={20} />
              </button>
            </div>

            {/* Center Stage */}
            <div className="relative flex-1 flex items-center justify-center min-h-0 max-w-6xl w-full mx-auto">
              {mediaItems.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrevMedia()
                  }}
                  className="absolute left-1 sm:left-3 z-[130] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#C3143D] border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xl"
                  aria-label="Previous item"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {activeLightboxIsVideo ? (
                <motion.div
                  key={`lb-vid-${lightboxIndex}`}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="w-full max-w-5xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl cursor-default border border-white/10 bg-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DeferredVimeoPlayer
                    videoId={activeLightboxSrc}
                    title={`${projectTitle} — ${lightboxIndex + 1}`}
                    thumbnailUrl={activeLightboxItem.coverImageUrl || undefined}
                    autoPlay
                  />
                </motion.div>
              ) : (
                <motion.img
                  key={`lb-img-${lightboxIndex}`}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  src={activeLightboxSrc}
                  alt={`${projectTitle} — ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[74vh] object-contain rounded-xl cursor-default shadow-2xl border border-white/10 bg-black"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {mediaItems.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNextMedia()
                  }}
                  className="absolute right-1 sm:right-3 z-[130] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#C3143D] border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xl"
                  aria-label="Next item"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            {mediaItems.length > 1 && (
              <div
                className="relative z-[130] max-w-4xl w-full mx-auto pt-4 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaItems.map((m: any, idx: number) => {
                  const isActive = idx === lightboxIndex
                  const isVid = m.type === 2
                  const thumb = isVid
                    ? m.coverImageUrl
                    : getOptimizedMediaUrl(m.mediaUrl || m.coverImageUrl, 240)
                  return (
                    <button
                      type="button"
                      key={m.id || idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-black ${
                        isActive
                          ? "border-[#C3143D] scale-105 shadow-[0_0_15px_rgba(195,20,61,0.6)]"
                          : "border-white/15 opacity-50 hover:opacity-90"
                      }`}
                    >
                      {thumb ? (
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Play size={14} className="text-[#C3143D] fill-current" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
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
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>All Projects</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D] animate-pulse" />
            {categoryName}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {isShared ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 size={12} />
                <span>Share</span>
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
            {isAlbum ? "Gallery Album" : "Case Study"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold uppercase text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {projectTitle}
          </h1>

          <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            A signature production crafted with cinematic precision, bespoke direction, and broadcast-grade media finishing by REVO.
          </p>
        </motion.div>
      </div>

      {/* ── MAIN STAGE: CINEMA SHOWCASE & PROJECT INFO SUITE SIDE-BY-SIDE ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT: PRIMARY CINEMA SHOWCASE ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className={`relative w-full ${heroIsVideo ? "aspect-video" : ""} rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] group`}
            >
              {heroMedia ? (
                heroIsVideo ? (
                  <div className="w-full h-full bg-black">
                    <DeferredVimeoPlayer
                      videoId={heroVideoSrc}
                      title={projectTitle}
                      thumbnailUrl={heroMedia.coverImageUrl || undefined}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full relative cursor-zoom-in overflow-hidden bg-black flex items-center justify-center"
                    onClick={() => setLightboxIndex(0)}
                  >
                    <img
                      src={getOptimizedMediaUrl(heroMedia.mediaUrl, 1400)}
                      alt={projectTitle}
                      className="w-full h-auto max-h-[620px] object-contain bg-black group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 pointer-events-none" />

                    {/* Bottom Label */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white pointer-events-none">
                      <span className="text-xs font-bold tracking-wider text-white/90 uppercase truncate max-w-[70%]">
                        {projectTitle}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shrink-0">
                        {isAlbum ? "Album Cover" : "Primary Visual"}
                      </span>
                    </div>

                    {/* Hover expand hint */}
                    <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full aspect-[16/10] bg-black flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-widest">
                  No Media Available
                </div>
              )}
            </motion.div>

            {/* Clean Feature Line */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/70">
              <div className="flex items-center justify-center gap-1.5">
                <Video size={13} className="text-[#C3143D]" />
                <span>Cinematic 4K</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 border-x border-white/5">
                <Sliders size={13} className="text-[#C3143D]" />
                <span>Color Grading</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-[#C3143D]" />
                <span>REVO Master</span>
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
                    Project Specifications
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/40">
                    REF-0{portfolio.orderIndex || 1}
                  </span>
                </div>
                <h3 className="text-xl font-sora font-extrabold text-white tracking-tight">
                  Overview & Deliverables
                </h3>
              </div>

              {/* Metadata Rows */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    Category
                  </span>
                  <span className="text-white font-bold tracking-wide">
                    {categoryName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    Execution
                  </span>
                  <span className="text-white font-medium">
                    Full-Spectrum Production
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    Deliverables
                  </span>
                  <span className="text-white font-medium">
                    {allVideos.length > 0 && `${allVideos.length} Films`}
                    {allVideos.length > 0 && allImages.length > 0 && " · "}
                    {allImages.length > 0 && `${allImages.length} High-Res`}
                    {mediaItems.length === 0 && "1 Master Visual"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <span className="text-white/40 uppercase tracking-wider font-semibold">
                    Studio
                  </span>
                  <span className="text-[#C3143D] font-bold">
                    REVO Creative Studio
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isAlbum && (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="w-full py-3.5 px-6 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 hover:border-white/30 text-white font-sora font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Images size={15} className="text-[#C3143D]" />
                    <span>Open Gallery Mode ({mediaItems.length})</span>
                  </button>
                )}

                <Link
                  href="/contact"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C3143D] to-[#990d2e] hover:from-[#d61745] hover:to-[#b00f35] text-white font-sora font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(195,20,61,0.4)] cursor-pointer"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowUpRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-3 px-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-sora font-semibold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>
                    {isShared ? "Link Copied to Clipboard" : "Share This Project"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── ALBUM GALLERY MODE (ADAPTIVE MASONRY GRID) ── */}
      {isAlbum && (
        <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#C3143D] mb-2">
                <Camera size={11} />
                Gallery Mode
              </div>
              <h3 className="text-xl sm:text-2xl font-sora font-extrabold uppercase text-white tracking-tight">
                Album Collection ({mediaItems.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-[#C3143D] border border-white/10 hover:border-[#C3143D] text-xs font-sora font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-all cursor-pointer w-fit"
            >
              <Maximize2 size={13} />
              <span>Fullscreen Slideshow</span>
            </button>
          </div>

          {/* Shortest-Column Adaptive Masonry Grid (Preserves Portrait & Landscape Naturally) */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {masonryColumns.map((col, colIdx) => (
              <div key={`masonry-col-${colIdx}`} className="flex flex-col gap-3">
                {col.map(({ item, globalIndex, key }) => {
                  const isVid = item.type === 2
                  const videoUrl = item.videoUrl || item.mediaUrl || ""
                  const imageUrl = getOptimizedMediaUrl(
                    item.mediaUrl || item.coverImageUrl,
                    1100
                  )

                  return (
                    <div
                      key={key}
                      onClick={() => setLightboxIndex(globalIndex)}
                      className="relative w-full overflow-hidden rounded-lg bg-black border border-white/15 hover:border-[#C3143D]/70 transition-all duration-300 group cursor-pointer shadow-lg"
                    >
                      {isVid ? (
                        <div className="relative w-full aspect-video bg-black">
                          <DeferredVimeoPlayer
                            videoId={videoUrl}
                            title={`${projectTitle} — ${globalIndex + 1}`}
                            thumbnailUrl={item.coverImageUrl || undefined}
                            onClick={() => setLightboxIndex(globalIndex)}
                          />
                        </div>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={`${projectTitle} — ${globalIndex + 1}`}
                            loading="lazy"
                            onLoad={(e) => handleImageMeasure(key, e.currentTarget)}
                            className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-black/70 border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 backdrop-blur-md">
                              <Maximize2 size={15} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
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
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sora font-semibold">
              {`Previous: ${prevProject.captionEn || prevProject.captionAr}`}
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
              {`Next: ${nextProject.captionEn || nextProject.captionAr}`}
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  )
}
