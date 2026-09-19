"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { usePortfolioDetail, useCategories } from "../hooks/usePortfolios"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { DeferredVimeoPlayer } from "@/components/ui/deferred-vimeo-player"

interface PortfolioDetailContentProps {
  slug: string
}

export function PortfolioDetailContent({ slug }: PortfolioDetailContentProps) {
  const router = useRouter()
  const { data: portfolio, isLoading, isError } = usePortfolioDetail(slug)
  const { data: categories = [] } = useCategories()
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isError) {
      router.push("/404")
      return
    }

    if (portfolio && containerRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      
      if (reduceMotion) {
        gsap.set(".detail-animate", { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        ".detail-animate",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      )
    }
  }, [portfolio, isError, router])

  if (isLoading) {
    return (
      <div className="pt-32 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!portfolio) {
    return null
  }

  const category = categories.find(c => c.id === portfolio.categoryId)

  return (
    <div ref={containerRef} className="pt-32 pb-16 relative z-10 noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back navigation */}
        <div className="mb-12 detail-animate">
          <Link 
            href="/portfolio"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Selected Works
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 md:mb-20 detail-animate">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-sora font-bold uppercase leading-tight max-w-4xl">
              {portfolio.titleEn}
            </h1>
            
            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background/50 backdrop-blur hover:border-primary/50 hover:text-primary transition-colors flex-shrink-0 w-fit">
              <Share2 size={18} />
              <span>Share Project</span>
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-foreground/50">Client:</span>
              <span className="font-semibold text-primary">{portfolio.clientName}</span>
            </div>
            {category && (
              <>
                <span className="text-border text-2xl hidden md:inline">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">Category:</span>
                  <span className="font-semibold">{category.nameEn}</span>
                </div>
              </>
            )}
            <span className="text-border text-2xl hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground/50">Format:</span>
              <span className="font-semibold capitalize">{portfolio.mediaType}</span>
            </div>
          </div>
        </div>

        {/* Media Player / Image */}
        <div className="mb-20 detail-animate">
          {portfolio.mediaType === "video" ? (
            <DeferredVimeoPlayer 
              videoId={portfolio.mediaUrl} 
              title={portfolio.titleEn}
            />
          ) : (
            <div className="relative w-full aspect-[21/9] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-border">
              <CloudinaryImage
                src={portfolio.mediaUrl}
                alt={portfolio.titleEn}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="grid md:grid-cols-12 gap-12 detail-animate">
          <div className="md:col-span-4">
            <h3 className="text-2xl font-sora font-bold uppercase mb-6 text-primary">About the Project</h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light">
              {portfolio.descriptionEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
