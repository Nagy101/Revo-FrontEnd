"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { team } from "../data"

export function AboutTeam() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      
      const cards = gridRef.current?.querySelectorAll(".team-card")
      
      if (reduceMotion) {
        if (cards) gsap.set(cards, { opacity: 1, rotationY: 0, scale: 1, z: 0 })
        return
      }

      if (cards) {
        gsap.fromTo(
          cards,
          {
            rotationY: -90,
            opacity: 0,
            z: -200,
            scale: 0.8,
          },
          {
            rotationY: 0,
            opacity: 1,
            z: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
          }
        )
      }
    }
  }, [hasIntersected])

  return (
    <section 
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-20 bg-muted/50 backdrop-blur-sm noise-overlay relative z-10 border-y border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sora font-bold uppercase mb-8">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Our diverse team of creatives, strategists, and visionaries work together to bring your ideas to life.
          </p>
        </div>

        {/* Team Grid */}
        <div ref={gridRef} className="team-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="team-card group text-center" style={{ transformStyle: "preserve-3d", opacity: 0 }}>
              {/* Member Image */}
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square w-full">
                <Image
                  src={member.image || "/placeholder.svg?height=400&width=400"}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info overlay */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm mb-2">{member.bio}</p>
                  <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs rounded-full">
                    {member.specialty}
                  </span>
                </div>
              </div>

              {/* Member Info */}
              <h3 className="text-xl font-sora font-bold mb-2">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
