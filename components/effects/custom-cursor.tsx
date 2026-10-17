"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isText, setIsText] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Ultra-responsive, smooth physics with zero trailing clutter
  const springConfig = { damping: 30, stiffness: 500, mass: 0.15 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable on desktop with fine pointer, and never on admin routes
    if (isAdmin || !window.matchMedia("(pointer: fine)").matches) return

    // Hide native cursor site-wide, preserve text cursor in inputs
    const style = document.createElement("style")
    style.innerHTML = `
      * { cursor: none !important; }
      input, textarea, [contenteditable="true"] { cursor: text !important; }
    `
    document.head.appendChild(style)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      const isInput = target.closest("input") || target.closest("textarea") || target.closest("select")
      const isClickable = target.closest("button") || 
                          target.closest("a") || 
                          target.closest("[role='button']") || 
                          target.closest("[data-cursor]") ||
                          target.closest(".group") ||
                          target.closest(".cursor-pointer")

      if (isInput) {
        setIsText(true)
        setIsHovered(false)
      } else if (isClickable) {
        setIsText(false)
        setIsHovered(true)
      } else {
        setIsText(false)
        setIsHovered(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [mouseX, mouseY, isVisible, isAdmin])

  // Don't render on text fields, off-screen, or admin routes
  if (isAdmin || !isVisible || isText) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isHovered ? 44 : 10,
        height: isHovered ? 44 : 10,
        scale: isClicking ? 0.75 : 1,
        backgroundColor: isHovered ? "rgba(195, 20, 61, 0.2)" : "#C3143D",
        border: isHovered ? "1.5px solid #C3143D" : "0px solid transparent",
        boxShadow: isHovered 
          ? "0 0 24px rgba(195, 20, 61, 0.5), inset 0 0 10px rgba(195, 20, 61, 0.25)" 
          : "0 0 12px rgba(195, 20, 61, 0.8), 0 0 4px rgba(255, 255, 255, 0.6)",
        backdropFilter: isHovered ? "blur(3px)" : "none",
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 28,
        mass: 0.2
      }}
    >
      {/* Precision center pinpoint that appears smoothly when hovering */}
      {isHovered && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#C3143D]"
        />
      )}
    </motion.div>
  )
}
