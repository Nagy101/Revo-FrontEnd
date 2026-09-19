"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const clientStats = [
  { number: 200, label: "Happy Clients", suffix: "+" },
  { number: 500, label: "Projects Completed", suffix: "+" },
  { number: 15, label: "Industries Served", suffix: "+" },
  { number: 98, label: "Client Retention", suffix: "%" },
]

const clients = [
  {
    name: "TechCorp",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Technology",
    description: "Leading software solutions provider",
  },
  {
    name: "Fashion Forward",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Fashion",
    description: "Luxury fashion brand",
  },
  {
    name: "Gourmet Delights",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Food & Beverage",
    description: "Premium restaurant chain",
  },
  {
    name: "FitLife Gym",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Fitness",
    description: "Modern fitness centers",
  },
  {
    name: "Luxury Hotels",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Hospitality",
    description: "5-star hotel chain",
  },
  {
    name: "StartupX",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Startup",
    description: "Innovative tech startup",
  },
  {
    name: "Beauty Essence",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Beauty",
    description: "Premium cosmetics brand",
  },
  {
    name: "AutoMax",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Automotive",
    description: "Luxury car dealership",
  },
  {
    name: "Netflix",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Entertainment",
    description: "Global streaming platform",
  },
  {
    name: "Apple",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Technology",
    description: "Innovation leader",
  },
  {
    name: "Google",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Technology",
    description: "Search and cloud services",
  },
  {
    name: "Microsoft",
    logo: "/placeholder.svg?height=80&width=160",
    industry: "Technology",
    description: "Software and cloud solutions",
  },
]

export function OurClientsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const clientsRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const tl = gsap.timeline()

      // Animate stats
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item")
        tl.fromTo(
          statItems,
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
        )

        // Count up numbers
        statItems.forEach((item, index) => {
          const numberElement = item.querySelector(".stat-number")
          if (numberElement) {
            const finalNumber = clientStats[index].number
            gsap.fromTo(
              numberElement,
              { textContent: 0 },
              {
                textContent: finalNumber,
                duration: 2,
                delay: 0.5 + index * 0.1,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function () {
                  numberElement.textContent = Math.ceil(
                    this.targets()[0].textContent,
                  ).toString()
                },
              },
            )
          }
        })
      }

      // Client logos entrance
      if (clientsRef.current) {
        const clientLogos = clientsRef.current.querySelectorAll(".client-logo")
        tl.fromTo(
          clientLogos,
          { opacity: 0, y: 20, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.3",
        )
      }
    }
  }, [hasIntersected])

  // Auto-scrolling slider
  useEffect(() => {
    if (sliderRef.current && hasIntersected) {
      const slider = sliderRef.current
      const logoWidth = 280 // width incl. gap
      const totalWidth = logoWidth * clients.length

      // Seamless loop by duplicating content
      const duplicateSlider = slider.cloneNode(true) as HTMLElement
      duplicateSlider.setAttribute("aria-hidden", "true")
      slider.parentNode?.appendChild(duplicateSlider)

      animationRef.current = gsap.to([slider, duplicateSlider], {
        x: -totalWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => `${Number.parseFloat(x) % totalWidth}px`,
        },
      })

      const pause = () => animationRef.current?.pause()
      const resume = () => animationRef.current?.resume()

      slider.addEventListener("mouseenter", pause)
      slider.addEventListener("mouseleave", resume)
      duplicateSlider.addEventListener("mouseenter", pause)
      duplicateSlider.addEventListener("mouseleave", resume)

      return () => {
        animationRef.current?.kill()
        slider.removeEventListener("mouseenter", pause)
        slider.removeEventListener("mouseleave", resume)
        duplicateSlider.removeEventListener("mouseenter", pause)
        duplicateSlider.removeEventListener("mouseleave", resume)
        duplicateSlider.remove()
      }
    }
  }, [hasIntersected])

  return (
    <section
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,0,0,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255,0,0,0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-sora font-bold uppercase mb-6">
            Our <span className="gradient-text">Clients</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Trusted by industry leaders and innovative brands worldwide
          </p>
        </div>

        {/* Client Statistics */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {clientStats.map((stat, index) => (
            <div key={index} className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-sora font-bold text-primary mb-2">
                <span className="stat-number">0</span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base text-foreground/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Auto-Sliding Client Logos */}
        <div className="relative overflow-hidden" ref={clientsRef}>
          <div className="flex gap-8 w-max" ref={sliderRef}>
            {clients.map((client, index) => (
              <div
                key={index}
                className="client-logo group relative bg-card/90 border border-border rounded-2xl overflow-hidden p-8 hover:border-primary/40 hover:ring-1 hover:ring-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 w-64 flex-shrink-0 focus-within:ring-2 focus-within:ring-primary/50"
                aria-label={`${client.name} - ${client.industry}`}
              >
                <div className="aspect-[2/1] relative overflow-hidden rounded-lg">
                  <img
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                {/* Improved Hover Overlay with better contrast */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6"
                  style={{
                    // Layered gradient: soft vignette + brand crimson duo
                    backgroundImage:
                      "radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.58) 55%), linear-gradient(135deg, rgba(195,20,61,0.95) 0%, rgba(240,79,106,0.90) 100%)",
                  }}
                >
                  <div className="text-center text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]">
                    <h3 className="font-sora font-semibold text-lg md:text-xl mb-1">{client.name}</h3>
                    <p className="text-xs md:text-sm text-white/90 mb-1">{client.industry}</p>
                    <p className="text-[11px] md:text-xs text-white/80">{client.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Fortune 500 Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Startups & SMEs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>International Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Local Businesses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
