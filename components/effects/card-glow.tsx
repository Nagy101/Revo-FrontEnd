"use client"

import type React from "react"
import { useRef } from "react"

/**
 * CardGlow
 * - Wraps card content with a cursor-follow glow.
 * - Uses CSS variables to position a radial gradient.
 * - Subtle by default, respects border radius via overflow-hidden.
 */
export function CardGlow({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)

  const setVars = (x: number, y: number, opacity: number) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
    el.style.setProperty("--glow-opacity", `${opacity}`)
  }

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setVars(x, y, 1)
  }

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setVars(x, y, 1)
  }

  const handleMouseLeave = () => {
    setVars(0, 0, 0)
  }

  return (
    <div
      ref={ref}
      className={`card-glow group relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Glow overlay */}
      <div className="glow-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      {children}
    </div>
  )
}
