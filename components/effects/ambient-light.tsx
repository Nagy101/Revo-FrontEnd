"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

export default function AmbientLight() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const spot1Ref = useRef<HTMLDivElement | null>(null)
  const spot2Ref = useRef<HTMLDivElement | null>(null)
  const spot3Ref = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const spots = [spot1Ref.current, spot2Ref.current, spot3Ref.current].filter(Boolean) as HTMLDivElement[]

    if (!container || spots.length < 1) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const rand = (min: number, max: number) => Math.random() * (max - min) + min

    const animations: gsap.core.Tween[] = []
    if (!reduceMotion) {
      spots.forEach((el, i) => {
        gsap.set(el, {
          xPercent: rand(-40, 40),
          yPercent: rand(-40, 40),
          scale: rand(0.8, 1.2),
          opacity: i === 2 ? 0.18 : 0.25,
        })

        const tween = gsap.to(el, {
          xPercent: `+=${rand(-40, 40)}`,
          yPercent: `+=${rand(-40, 40)}`,
          scale: rand(0.9, 1.2),
          duration: rand(10, 18),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
        animations.push(tween)
      })
    } else {
      gsap.set(spots[0], { xPercent: -25, yPercent: -10, opacity: 0.25 })
      gsap.set(spots[1], { xPercent: 25, yPercent: 10, opacity: 0.25 })
      gsap.set(spots[2], { xPercent: 0, yPercent: 25, opacity: 0.18 })
    }

    let targetX = 0
    let targetY = 0

    const updateParallax = () => {
      gsap.to(container, {
        x: targetX * 20,
        y: targetY * 20,
        duration: 0.6,
        ease: "power2.out",
      })
      rafRef.current = null
    }

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5
      targetY = e.clientY / window.innerHeight - 0.5
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateParallax)
      }
    }
    
    window.addEventListener("mousemove", handleMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      animations.forEach((a) => a.kill())
      gsap.set(container, { clearProps: "all" })
      spots.forEach((el) => gsap.set(el, { clearProps: "all" }))
    }
  }, [])

  const baseStyle: React.CSSProperties = {
    background: "radial-gradient(closest-side, currentColor 0%, transparent 60%)",
  }

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={spot1Ref} className="light-spot mix-blend-screen" style={{ ...baseStyle, color: "var(--primary)" }} />
      <div ref={spot2Ref} className="light-spot mix-blend-screen" style={{ ...baseStyle, color: "var(--secondary)" }} />
      <div ref={spot3Ref} className="light-spot mix-blend-screen" style={{ ...baseStyle, color: "rgba(255,255,255,0.25)" }} />
    </div>
  )
}
