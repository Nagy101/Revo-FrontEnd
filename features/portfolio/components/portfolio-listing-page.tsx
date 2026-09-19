"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Grid, List } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { CardGlow } from "@/components/effects/card-glow"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { usePublicPortfolios } from "../hooks/usePortfolios"
import { useCategories } from "@/features/categories/hooks/useCategories"

export function PortfolioListingPage() {
  const { data: portfolios = [], isLoading: isLoadingPortfolios } = usePublicPortfolios()
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories()
  
  const categories = categoriesResponse?.data?.data || []

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProjects, setFilteredProjects] = useState(portfolios)

  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(portfolios)
    } else {
      setFilteredProjects(portfolios.filter(p => p.categoryId === selectedCategory))
    }
  }, [selectedCategory, portfolios])

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      gsap.set(".portfolio-header", { opacity: 1, y: 0 })
      return
    }

    if (pageRef.current) {
      gsap.fromTo(
        ".portfolio-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2 }
      )
    }
  }, [])

  if (isLoadingPortfolios || isLoadingCategories) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div ref={pageRef} className="pt-24 pb-16 relative z-10 noise-overlay min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 portfolio-header">
          <h1 className="text-5xl md:text-7xl font-sora font-bold uppercase mb-6">
            Selected <span className="gradient-text">Works</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            A curated showcase of our finest cinematic projects, demonstrating our commitment to excellence and innovation.
          </p>
        </div>

        {/* Filters and View Toggles */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 portfolio-header">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "All" 
                  ? "bg-primary text-white" 
                  : "bg-background border border-border hover:border-primary/50 text-foreground/80"
              }`}
            >
              All Works
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id 
                    ? "bg-primary text-white" 
                    : "bg-background border border-border hover:border-primary/50 text-foreground/80"
                }`}
              >
                {category.nameEn}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-primary/20 text-primary" : "text-foreground/60 hover:text-foreground"
              }`}
              aria-label="Grid View"
            >
              <Grid size={24} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-primary/20 text-primary" : "text-foreground/60 hover:text-foreground"
              }`}
              aria-label="List View"
            >
              <List size={24} />
            </button>
          </div>
        </div>

        {/* Portfolio Content */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 portfolio-header">
            <h3 className="text-2xl font-bold mb-4">No projects found</h3>
            <p className="text-foreground/60 mb-8">Try adjusting your filters to see more projects</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "flex flex-col gap-8"
          }>
            {filteredProjects.map((project) => {
              const category = categories.find(c => c.id === project.categoryId)
              return (
                <CardGlow
                  key={project.id}
                  className={`group overflow-hidden rounded-3xl border border-border/50 hover:border-primary/50 transition-colors ${
                    viewMode === "list" ? "md:flex" : ""
                  }`}
                >
                  <Link href={`/portfolio/${project.slug}`} className="block h-full w-full">
                    <div className={`relative ${viewMode === "list" ? "md:w-2/5 h-full min-h-[300px]" : "aspect-[4/3] w-full"}`}>
                      <CloudinaryImage
                        src={project.mediaUrl}
                        alt={project.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        {category && (
                          <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-white rounded-full backdrop-blur-md">
                            {category.nameEn}
                          </span>
                        )}
                        <span className="px-3 py-1 text-xs font-medium bg-secondary/90 text-white rounded-full backdrop-blur-md">
                          {project.mediaType}
                        </span>
                      </div>
                    </div>

                    <div className={`p-8 ${viewMode === "list" ? "md:w-3/5 flex flex-col justify-center" : ""}`}>
                      <div className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                        {project.clientName}
                      </div>
                      <h3 className="text-2xl font-sora font-bold mb-4 group-hover:text-primary transition-colors">
                        {project.titleEn}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed line-clamp-2 mb-6">
                        {project.descriptionEn}
                      </p>
                      
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                        View Project
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </div>
                    </div>
                  </Link>
                </CardGlow>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
