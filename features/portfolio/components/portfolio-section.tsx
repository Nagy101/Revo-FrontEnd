"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Filter } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { CardGlow } from "@/components/effects/card-glow"
import { usePublicPortfolios } from "../hooks/usePortfolios"

export function PortfolioSection() {
  const { data: portfolios = [], isLoading } = usePublicPortfolios()
  const sectionRef = useRef<HTMLElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Derive categories from data
  const categories = useMemo(() => {
    const cats = new Set(portfolios.map(p => p.categoryId))
    return ["All", ...Array.from(cats)]
  }, [portfolios])

  const filteredPortfolios = useMemo(() => {
    if (selectedCategory === "All") return portfolios
    return portfolios.filter(p => p.categoryId === selectedCategory)
  }, [portfolios, selectedCategory])

  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      
      if (reduceMotion) {
        gsap.set([filtersRef.current, carouselRef.current], { opacity: 1, y: 0, scale: 1 })
        return
      }

      const tl = gsap.timeline()
      tl.fromTo(
        filtersRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      tl.fromTo(
        carouselRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
    }
  }, [hasIntersected])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredPortfolios.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredPortfolios.length) % filteredPortfolios.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30 min-h-[600px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  if (portfolios.length === 0) return null

  return (
    <section 
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-24 bg-muted/30 relative overflow-hidden noise-overlay"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-sora font-bold uppercase mb-6">
            Selected <span className="gradient-text">Work</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Explore our diverse collection of creative work
          </p>
        </div>

        {categories.length > 2 && (
          <div ref={filtersRef} className="mb-12 opacity-0">
            <div className="flex items-center justify-center mb-6">
              <Filter className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm font-medium text-foreground/70">Filter Projects</span>
            </div>
            <div className="flex justify-center gap-4 max-w-4xl mx-auto overflow-x-auto pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background border border-border hover:border-primary/50"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={carouselRef} className="relative opacity-0">
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredPortfolios.map((project, index) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="relative aspect-[16/9] group cursor-pointer">
                    <Image
                      src={project.mediaUrl || "/placeholder.svg?height=900&width=1600"}
                      alt={project.titleEn}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {project.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                          {project.categoryId}
                        </span>
                        <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {project.clientName}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-sora font-bold text-white mb-2">{project.titleEn}</h3>
                      <p className="text-white/80 text-sm md:text-base max-w-2xl">{project.descriptionEn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredPortfolios.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
