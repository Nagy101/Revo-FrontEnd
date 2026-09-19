"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { usePublicClients } from "../hooks/useClients"

const clientStats = [
  { number: 200, label: "Happy Clients", suffix: "+" },
  { number: 500, label: "Projects Completed", suffix: "+" },
  { number: 15, label: "Industries Served", suffix: "+" },
  { number: 98, label: "Client Retention", suffix: "%" },
]

export function ClientsSection() {
  const { data: clients = [], isLoading } = usePublicClients()

  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const clientsRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const statItems = statsRef.current?.querySelectorAll(".stat-item")
      const clientItems = clientsRef.current?.querySelectorAll(".client-item")
      
      if (reduceMotion) {
        if (statItems) gsap.set(statItems, { opacity: 1, y: 0, scale: 1 })
        if (clientItems) gsap.set(clientItems, { opacity: 1, scale: 1 })
        
        // Immediately set numbers to final value
        if (statItems) {
          statItems.forEach((item, index) => {
            const numberElement = item.querySelector(".stat-number")
            if (numberElement) {
              numberElement.innerHTML = clientStats[index].number.toString() + clientStats[index].suffix
            }
          })
        }
        return
      }

      const tl = gsap.timeline()

      // Animate stats
      if (statsRef.current && statItems) {
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
          }
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
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 0.2,
                onUpdate: function () {
                  numberElement.innerHTML = Math.ceil(Number(this.targets()[0].textContent)) + clientStats[index].suffix
                },
              }
            )
          }
        })
      }

      // Animate client grid
      if (clientsRef.current) {
        const clientItems = clientsRef.current.querySelectorAll(".client-item")
        tl.fromTo(
          clientItems,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.5)",
          },
          "-=1"
        )
      }
    }
  }, [hasIntersected])

  // Continuous marquee animation
  useEffect(() => {
    if (sliderRef.current && clients.length > 0) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduceMotion) return

      const slider = sliderRef.current
      const sliderWidth = slider.scrollWidth / 2

      gsap.to(slider, {
        x: -sliderWidth,
        ease: "none",
        duration: 30,
        repeat: -1,
      })
    }
  }, [clients])

  if (isLoading) {
    return (
      <section className="py-24 bg-background min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  if (clients.length === 0) return null

  // Duplicate clients for seamless marquee
  const marqueeClients = [...clients, ...clients]

  return (
    <section
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-24 bg-background border-t border-border/50 relative overflow-hidden noise-overlay"
    >
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sora font-bold uppercase mb-6">
            Trusted By <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            We partner with visionary brands to create exceptional digital experiences that drive growth and innovation.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {clientStats.map((stat, index) => (
            <div key={index} className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold font-sora text-primary mb-2">
                <span className="stat-number">0</span>
                <span>{stat.suffix}</span>
              </div>
              <p className="text-sm text-foreground/70 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden bg-muted/30 py-12 border-y border-border/50">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div ref={sliderRef} className="flex w-max items-center">
          {marqueeClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="client-item flex-shrink-0 w-48 md:w-64 px-8 group"
            >
              <div className="relative h-16 w-full grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 cursor-pointer">
                <Image
                  src={client.logoUrl || "/placeholder.svg?height=80&width=160"}
                  alt={client.name}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  className="object-contain"
                />
              </div>
              <div className="text-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-foreground/70 font-medium">{client.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
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
