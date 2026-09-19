"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"
import { values } from "../data"

export function AboutValues() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const cards = cardsRef.current?.querySelectorAll(".value-card")
    
    if (cards) {
      cards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const ev = e as globalThis.MouseEvent
          const rect = card.getBoundingClientRect()
          const x = ev.clientX - rect.left - rect.width / 2
          const y = ev.clientY - rect.top - rect.height / 2

          gsap.to(card, {
            rotationY: x * 0.15,
            rotationX: -y * 0.15,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out",
          })

          // Add glow effect based on mouse position
          const intensity = Math.min(Math.sqrt(x * x + y * y) / 100, 1)
          gsap.to(card, {
            boxShadow: `0 0 ${20 * intensity}px rgba(195, 20, 61, ${0.3 * intensity})`,
            duration: 0.3,
          })
        }

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            boxShadow: "none",
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          })
        }

        card.addEventListener("mousemove", handleMouseMove as EventListener)
        card.addEventListener("mouseleave", handleMouseLeave)

        return () => {
          card.removeEventListener("mousemove", handleMouseMove as EventListener)
          card.removeEventListener("mouseleave", handleMouseLeave)
        }
      })
    }
  }, [])

  return (
    <OptimizedGSAPSection
      className="py-20 relative z-10 noise-overlay"
      animationType="stagger"
      threshold={0.2}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 data-animate className="text-4xl md:text-5xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Values</span>
          </h2>
          <p data-animate className="text-xl text-foreground/80 max-w-3xl mx-auto">
            These core values guide everything we do and shape how we work with our clients.
          </p>
        </div>

        {/* Values Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              data-animate
              className="value-card text-center p-8 bg-background/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <value.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-sora font-bold mb-4">{value.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </OptimizedGSAPSection>
  )
}
