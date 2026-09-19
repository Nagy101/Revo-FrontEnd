"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Filter } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { CardGlow } from "@/components/effects/card-glow"

const projects = [
  {
    id: 1,
    title: "Nike Air Max Campaign",
    serviceType: "Commercials",
    industry: "Sports",
    format: "Video",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Nike+Campaign",
    video: "/placeholder.svg?height=400&width=600",
    description: "High-energy commercial showcasing the latest Nike Air Max collection",
  },
  {
    id: 2,
    title: "Fashion Week Coverage",
    serviceType: "Event Coverage",
    industry: "Fashion",
    format: "Photography",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Fashion+Week",
    video: null,
    description: "Comprehensive coverage of Milan Fashion Week 2024",
  },
  {
    id: 3,
    title: "Tesla Model S Launch",
    serviceType: "Product Shoots",
    industry: "Automotive",
    format: "Video",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Tesla+Launch",
    video: "/placeholder.svg?height=400&width=600",
    description: "Cinematic product launch video for Tesla's latest model",
  },
  {
    id: 4,
    title: "Tech Startup Reels",
    serviceType: "Social Media Content",
    industry: "Technology",
    format: "Reels / Shorts",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Tech+Reels",
    video: "/placeholder.svg?height=400&width=600",
    description: "Engaging social media content for emerging tech companies",
  },
  {
    id: 5,
    title: "Wellness Documentary",
    serviceType: "Documentary",
    industry: "Health & Wellness",
    format: "Video",
    year: "2023",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Wellness+Doc",
    video: "/placeholder.svg?height=400&width=600",
    description: "Documentary exploring modern wellness practices",
  },
  {
    id: 6,
    title: "Music Video Production",
    serviceType: "Music Videos",
    industry: "Entertainment",
    format: "Video",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Music+Video",
    video: "/placeholder.svg?height=400&width=600",
    description: "Creative music video for emerging artist",
  },
  {
    id: 7,
    title: "Corporate Headshots",
    serviceType: "Corporate Videos",
    industry: "Technology",
    format: "Photography",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Corporate",
    video: null,
    description: "Professional corporate photography for tech executives",
  },
  {
    id: 8,
    title: "Real Estate Aerial",
    serviceType: "Drone Footage",
    industry: "Real Estate",
    format: "Video",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Drone+Real+Estate",
    video: "/placeholder.svg?height=400&width=600",
    description: "Stunning aerial footage of luxury properties",
  },
  {
    id: 9,
    title: "Brand Animation",
    serviceType: "Animation / Motion Graphics",
    industry: "Technology",
    format: "Video",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Animation",
    video: "/placeholder.svg?height=400&width=600",
    description: "Motion graphics for tech brand identity",
  },
  {
    id: 10,
    title: "Restaurant BTS",
    serviceType: "Social Media Content",
    industry: "Food & Beverage",
    format: "Behind the Scenes (BTS)",
    year: "2024",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Restaurant+BTS",
    video: "/placeholder.svg?height=400&width=600",
    description: "Behind-the-scenes content for premium restaurant",
  },
]

const filterOptions = {
  serviceType: [
    "All",
    "Commercials",
    "Event Coverage",
    "Social Media Content",
    "Documentary",
    "Music Videos",
    "Corporate Videos",
    "Product Shoots",
    "Drone Footage",
    "Animation / Motion Graphics",
  ],
  industry: [
    "All",
    "Sports",
    "Fashion",
    "Automotive",
    "Technology",
    "Health & Wellness",
    "Real Estate",
    "Education",
    "Food & Beverage",
  ],
  format: ["All", "Video", "Photography", "Reels / Shorts", "Behind the Scenes (BTS)", "Case Studies"],
  year: ["All", "2025", "2024", "2023"],
}

export function OptimizedFeaturedProjectsSection() {
  const [filters, setFilters] = useState({
    serviceType: "All",
    industry: "All",
    format: "All",
    year: "All",
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filteredProjects, setFilteredProjects] = useState(projects)

  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  })

  // Filter projects based on selected filters
  useEffect(() => {
    const filtered = projects.filter((project) => {
      return (
        (filters.serviceType === "All" || project.serviceType === filters.serviceType) &&
        (filters.industry === "All" || project.industry === filters.industry) &&
        (filters.format === "All" || project.format === filters.format) &&
        (filters.year === "All" || project.year === filters.year)
      )
    })
    setFilteredProjects(filtered)
    setCurrentIndex(0)
  }, [filters])

  // Animation on intersection
  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const tl = gsap.timeline()

      // Animate filters
      if (filtersRef.current) {
        const filterElements = filtersRef.current.querySelectorAll(".filter-dropdown")
        tl.fromTo(
          filterElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
        )
      }

      // Animate carousel
      if (carouselRef.current) {
        tl.fromTo(
          carouselRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3",
        )
      }
    }
  }, [hasIntersected])

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === filteredProjects.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredProjects.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (filteredProjects.length === 0) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-sora font-bold uppercase mb-8">
            Featured <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-foreground/60">No projects match your current filters.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-sora font-bold uppercase mb-6">
            Featured <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Explore our diverse collection of creative work across industries and formats
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div ref={filtersRef} className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Filter className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium text-foreground/70">Filter Projects</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {Object.entries(filterOptions).map(([filterType, options]) => (
              <div key={filterType} className="filter-dropdown">
                <label className="block text-sm font-medium text-foreground/70 mb-2 capitalize">
                  {filterType === "serviceType" ? "Service Type" : filterType}
                </label>
                <select
                  value={filters[filterType as keyof typeof filters]}
                  onChange={(e) => handleFilterChange(filterType as keyof typeof filters, e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div ref={carouselRef} className="relative">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="relative aspect-[16/9] group cursor-pointer">
                    <Image
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button for Videos */}
                    {project.video && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                          {project.serviceType}
                        </span>
                        <span className="px-3 py-1 bg-secondary text-white text-xs font-medium rounded-full">
                          {project.industry}
                        </span>
                        <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {project.format}
                        </span>
                        <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-sora font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-white/80 text-sm md:text-base max-w-2xl">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredProjects.length > 1 && (
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

          {/* Dots Indicator */}
          {filteredProjects.length > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex ? "bg-primary" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {filteredProjects.length > 1 && (
          <div className="mt-8 overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {filteredProjects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex ? "border-primary scale-105" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <CardGlow className="w-full h-full rounded-lg">
                    <Image
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    {index === currentIndex && <div className="absolute inset-0 bg-primary/20" />}
                  </CardGlow>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="text-center mt-8">
          <p className="text-sm text-foreground/60">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
      </div>
    </section>
  )
}
