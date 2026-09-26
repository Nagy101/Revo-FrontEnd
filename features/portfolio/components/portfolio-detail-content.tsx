"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, Tag, Check, Image as ImageIcon, Film, X, Maximize2 } from "lucide-react"
import { usePortfolioDetails } from "../hooks/usePortfolios"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { DeferredVimeoPlayer } from "@/components/ui/deferred-vimeo-player"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

interface PortfolioDetailContentProps {
  slug: string
}

const EASE = [0.16, 1, 0.3, 1] as const

export function PortfolioDetailContent({ slug }: PortfolioDetailContentProps) {
  const router = useRouter()
  const { data: response, isLoading, isError } = usePortfolioDetails(slug)
  const portfolio = response?.data
  
  useEffect(() => {
    if (isError) {
      router.push("/404")
      return
    }
  }, [isError, router])

  // Mouse tracking for global glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 0.5 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  const [isShared, setIsShared] = useState(false)
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: portfolio?.captionEn || 'Project by REVO',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      }
    } catch (err) {
      console.log('Error sharing', err)
    }
  }

  // Pre-calculate media arrays using optional chaining so hooks can be called safely
  const allImages = portfolio?.mediaItems?.filter((m: any) => m.type !== 2) || []
  const allVideos = portfolio?.mediaItems?.filter((m: any) => m.type === 2) || []

  // Hero uses first image if available, else first video
  const heroIsImage = allImages.length > 0
  const heroMedia = heroIsImage ? allImages[0] : allVideos[0]
  
  // Gallery gets the REST
  const galleryImages = heroIsImage ? allImages.slice(1) : allImages
  const galleryVideos = heroIsImage ? allVideos : allVideos.slice(1)
  
  const hasBoth = galleryImages.length > 0 && galleryVideos.length > 0
  
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>(
    galleryImages.length > 0 ? 'images' : 'videos'
  )
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
      </div>
    )
  }

  if (!portfolio) {
    return null
  }

  return (
    <div 
      className="min-h-screen bg-[#050505] text-white pt-32 pb-32 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedMedia(null)}
          >
            <button 
              className="absolute top-6 right-6 p-4 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors z-[110]"
              onClick={() => setSelectedMedia(null)}
            >
              <X size={24} />
            </button>
            
            {selectedMedia.type === 'image' ? (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedMedia.url}
                className="max-w-full max-h-full object-contain rounded-xl cursor-default shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {/* For the modal, we force load by passing no onClick so it plays automatically */}
                <DeferredVimeoPlayer 
                  videoId={selectedMedia.url} 
                  title="Video Player"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Mouse Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#C3143D]/[0.15] rounded-full blur-[140px] pointer-events-none z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-8 md:mb-12"
        >
          <Link 
            href="/portfolio"
            className="group inline-flex items-center gap-3 text-white/50 hover:text-[#C3143D] transition-colors duration-300 font-medium text-sm tracking-widest uppercase"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* --- HERO SPLIT LAYOUT --- */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-center min-h-[50vh] lg:min-h-[60vh] mb-16 lg:mb-32">
          
          {/* Left Column: Hero Image (Swapped to Left) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="lg:col-span-7 relative w-full h-[40vh] sm:h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden bg-[#111] order-1 border border-white/5 shadow-2xl group cursor-zoom-in"
            onClick={() => {
              if (heroIsImage && heroMedia?.mediaUrl) {
                setSelectedMedia({ url: heroMedia.mediaUrl, type: 'image' })
              }
            }}
          >
            {heroMedia ? (
              heroIsImage ? (
                <>
                  <CloudinaryImage
                    src={heroMedia.mediaUrl || "/images/placeholder.jpg"}
                    alt={portfolio.captionEn}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 drop-shadow-lg" />
                  </div>
                </>
              ) : (
                <DeferredVimeoPlayer 
                  videoId={heroMedia.mediaUrl || ""} 
                  title={portfolio.captionEn}
                  onClick={() => {
                    if (heroMedia?.mediaUrl) {
                      setSelectedMedia({ url: heroMedia.mediaUrl, type: 'video' })
                    }
                  }}
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <span className="font-bold text-2xl uppercase tracking-widest">No Media</span>
              </div>
            )}
          </motion.div>

          {/* Right Column: Typography & Actions (Swapped to Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-5 flex flex-col items-start order-2"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6 border border-white/10 rounded-full px-4 py-2 bg-white/[0.02]">
              <Tag size={14} className="text-[#C3143D]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                {portfolio.categoryNameEn}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase leading-[0.95] tracking-tight mb-8 sm:mb-12 drop-shadow-2xl text-white">
              {portfolio.captionEn}
            </h1>

            <div className="w-full h-px bg-white/10 mb-8 sm:mb-12" />

            <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center gap-6 sm:gap-12 w-full">
              <div className="flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Category</span>
                <span className="font-medium text-white/90">{portfolio.categoryNameEn}</span>
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-white/10" />

              <button 
                onClick={handleShare}
                className="group flex flex-col gap-2 text-left sm:text-left"
              >
                <span className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Share</span>
                <span className="flex items-center gap-2 font-medium text-white/90 group-hover:text-[#C3143D] transition-colors">
                  {isShared ? "Copied!" : "Share Project"}
                  <Share2 size={14} className={isShared ? "text-green-400" : ""} />
                </span>
              </button>
            </div>
          </motion.div>
        </div>


        {/* --- GALLERY SECTION --- */}
        {(galleryImages.length > 0 || galleryVideos.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: EASE }}
            className="w-full border-t border-white/5 pt-20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#C3143D]" />
                <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-[#C3143D]">
                  Project Gallery
                </h3>
              </div>

              {/* Media Type Toggle */}
              {hasBoth && (
                <div className="flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors z-10 ${activeTab === 'images' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {activeTab === 'images' && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <ImageIcon size={16} />
                    Images
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors z-10 ${activeTab === 'videos' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {activeTab === 'videos' && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <Film size={16} />
                    Videos
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {/* Videos Grid */}
                {activeTab === 'videos' && galleryVideos.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {galleryVideos.map((video: any, index: number) => (
                      <div key={`vid-${index}`} className="w-full rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl aspect-video relative group">
                        <DeferredVimeoPlayer 
                          videoId={video.mediaUrl || ""} 
                          title={`${portfolio.captionEn} Video ${index + 1}`}
                          onClick={() => {
                            if (video.mediaUrl) {
                              setSelectedMedia({ url: video.mediaUrl, type: 'video' })
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Images Split Layout */}
                {activeTab === 'images' && galleryImages.length > 0 && (
                  <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Left Side: Large Featured Gallery Image */}
                    <div 
                      className="lg:col-span-8 relative w-full min-h-[50vh] lg:min-h-[80vh] rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl group cursor-zoom-in"
                      onClick={() => setSelectedMedia({ url: galleryImages[0].mediaUrl, type: 'image' })}
                    >
                      <CloudinaryImage
                        src={galleryImages[0].mediaUrl || "/images/placeholder.jpg"}
                        alt={`${portfolio.captionEn} Featured Gallery`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Right Side: Stacked Thumbnails */}
                    {galleryImages.length > 1 && (
                      <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
                        {galleryImages.slice(1).map((image: any, index: number) => (
                          <div 
                            key={`thumb-${index}`} 
                            className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl group cursor-zoom-in"
                            onClick={() => setSelectedMedia({ url: image.mediaUrl, type: 'image' })}
                          >
                            <CloudinaryImage
                              src={image.mediaUrl || "/images/placeholder.jpg"}
                              alt={`${portfolio.captionEn} Gallery ${index + 2}`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 30vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                              <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 drop-shadow-lg" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  )
}
