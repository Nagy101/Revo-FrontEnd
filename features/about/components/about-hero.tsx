"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && sectionRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      
      const animateCounter = (element: HTMLElement, target: number) => {
        if (reduceMotion) {
          element.textContent = target.toString()
          return
        }

        const obj = { value: 0 }
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const currentValue = Math.floor(obj.value)
            element.textContent = currentValue.toString()
            if (obj.value < target) {
              element.style.textShadow = "0 0 10px rgba(195, 20, 61, 0.5)" // Using Crimson #C3143D roughly
            } else {
              element.style.textShadow = "none"
            }
          },
        })
      }

      if (reduceMotion) {
        gsap.set(".stat-card", { opacity: 1, scale: 1, rotationY: 0 })
        document.querySelectorAll(".stat-number").forEach((el) => {
          const target = Number.parseInt((el as HTMLElement).dataset.count || "0")
          animateCounter(el as HTMLElement, target)
        })
        return
      }

      // Stats animation
      gsap.fromTo(
        ".stat-card",
        {
          scale: 0.8,
          opacity: 0,
          rotationY: -45,
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          onComplete: () => {
            document.querySelectorAll(".stat-number").forEach((el) => {
              const target = Number.parseInt((el as HTMLElement).dataset.count || "0")
              animateCounter(el as HTMLElement, target)
            })
          },
        }
      )
    }
  }, [hasIntersected])

  return (
    <section 
      ref={(el) => {
        sectionRef.current = el
        elementRef.current = el
      }}
      className="py-24 noise-overlay relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <div>
            <h1 className="text-5xl md:text-7xl font-sora font-bold uppercase mb-8 leading-tight">
              About <span className="gradient-text">REVO</span>
            </h1>

            <div className="space-y-6">
              <p className="text-xl text-foreground/80 leading-relaxed">
                We are a premium creative agency born from the belief that every brand has a unique story worth
                telling. Our mission is to transform ideas into powerful visual narratives that connect, inspire, and
                drive results.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Founded in 2019, REVO has grown from a small creative collective to a full-service agency working with
                brands across fashion, technology, sports, and entertainment industries.
              </p>
            </div>

            {/* Statistics Grid */}
            <div ref={statsRef} className="stats-container grid grid-cols-3 gap-8 mt-12">
              <div className="stat-card text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div
                  className="stat-number text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
                  data-count="150"
                >
                  0
                </div>
                <div className="text-sm text-foreground/60 font-medium">Projects</div>
              </div>
              <div className="stat-card text-center p-6 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl border border-secondary/20 backdrop-blur-sm hover:border-secondary/40 transition-all duration-300">
                <div
                  className="stat-number text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2"
                  data-count="45"
                >
                  0
                </div>
                <div className="text-sm text-foreground/60 font-medium">Awards</div>
              </div>
              <div className="stat-card text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div
                  className="stat-number text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
                  data-count="12"
                >
                  0
                </div>
                <div className="text-sm text-foreground/60 font-medium">Years</div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative group">
              <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="REVO Team"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-primary/25 group-hover:scale-105 object-cover"
                  priority
                />
              </div>

              {/* Holographic overlay */}
              <div className="absolute inset-0 max-w-[500px] mx-auto rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Neo badge with pulse effect */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
                <span className="text-white font-bold text-2xl animate-pulse">REVO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
