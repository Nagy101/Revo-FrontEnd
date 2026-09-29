"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable on desktop/devices with a precise pointer
    if (!window.matchMedia("(pointer: fine)").matches) return
    
    setIsVisible(true)
    
    // Hide default cursor on interactive elements as well to ensure it stays hidden
    const style = document.createElement("style")
    style.innerHTML = `* { cursor: none !important; }`
    document.head.appendChild(style)

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Look for data-cursor attribute
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement
      
      if (cursorTarget) {
        setIsHovered(true)
        setCursorText(cursorTarget.getAttribute('data-cursor') || "")
      } else if (target.closest('button') || target.closest('a')) {
        setIsHovered(true)
        setCursorText("")
      } else {
        setIsHovered(false)
        setCursorText("")
      }
    }

    window.addEventListener("mousemove", updateMousePosition, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseOver)
      document.head.removeChild(style)
    }
  }, [mouseX, mouseY])

  if (!isVisible) return null

  return (
    <>
      {/* ── SMALL DOT ── */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#C3143D] rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHovered ? 0 : 1
        }}
      />
      
      {/* ── TRAILING RING / TEXT BUBBLE ── */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[9998] overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? (cursorText ? 80 : 50) : 32,
          height: isHovered ? (cursorText ? 80 : 50) : 32,
          backgroundColor: isHovered ? "#C3143D" : "transparent",
          border: isHovered ? "0px solid transparent" : "1.5px solid rgba(195, 20, 61, 0.5)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isHovered && cursorText ? 1 : 0, scale: isHovered && cursorText ? 1 : 0.5 }}
          className="text-white font-sora text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          {cursorText}
        </motion.span>
      </motion.div>
    </>
  )
}
