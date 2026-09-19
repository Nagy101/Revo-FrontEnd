"use client"

import { useEffect, useState } from "react"
import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"
import { LazyLottie } from "@/components/lazy-lottie"
import { CardGlow } from "@/components/effects/card-glow"
import { usePublicServices } from "../hooks/useServices"

export function ServicesSection() {
  const { data: services = [], isLoading } = usePublicServices()
  const [animations, setAnimations] = useState<any>(null)

  useEffect(() => {
    import("@/lib/lottie-animations").then((mod) => {
      setAnimations(mod.serviceAnimations)
    })
  }, [])

  if (isLoading) {
    return (
      <section className="py-32 bg-muted flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  if (services.length === 0) return null

  return (
    <OptimizedGSAPSection
      className="py-32 bg-muted noise-overlay"
      animationType="stagger"
      threshold={0.2}
      rootMargin="50px"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 data-animate className="text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p data-animate className="text-xl text-foreground/80 max-w-3xl mx-auto">
            We offer a comprehensive suite of creative services designed to elevate your brand and connect with your
            audience on a deeper level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // Find corresponding animation or fallback
            const animData = animations ? (animations[service.titleEn] || animations["Video Production"]) : null

            return (
              <CardGlow
                key={service.id}
                className="group service-card p-8 bg-background/50 backdrop-blur-sm rounded-3xl md:rounded-[28px] lg:rounded-[32px] overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                data-animate
              >
                <div className="mb-6 flex justify-center">
                  {animData ? (
                    <LazyLottie
                      animationData={animData}
                      size={64}
                      hover={true}
                      priority={index < 3} // Prioritize first 3 services
                      className="text-primary transition-colors duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <h3 className="text-2xl font-sora font-bold mb-4 text-center transition-colors duration-300 group-hover:text-primary">
                  {service.titleEn}
                </h3>
                <p className="text-foreground/70 leading-relaxed text-center">{service.descriptionEn}</p>
              </CardGlow>
            )
          })}
        </div>
      </div>
    </OptimizedGSAPSection>
  )
}
