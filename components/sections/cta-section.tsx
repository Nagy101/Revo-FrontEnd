"use client"

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'
import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CTASection() {
  const containerRef = useGSAP(() => {
    gsap.fromTo('.cta-elem', 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    )
  })

  // Mouse tracking states
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 150, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 150, mass: 0.5 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <section 
      ref={containerRef} 
      className="py-24 md:py-32 bg-[#050505] relative overflow-hidden border-t border-white/[0.06]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default Center Glow (fades out when mouse enters) */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C3143D]/[0.04] rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
      />

      {/* Interactive Interactive Glow */}
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C3143D]/[0.08] rounded-full blur-[120px] pointer-events-none z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHovered ? 1 : 0
        }}
        transition={{ opacity: { duration: 0.5 } }}
      />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <p className="cta-elem text-[#C3143D] text-sm font-bold uppercase tracking-[0.2em] mb-4">
          Let's Create Together
        </p>
        
        <h2 className="cta-elem text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
          Ready to build something <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C3143D]">extraordinary?</span>
        </h2>
        
        <p className="cta-elem text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
          Whether you need a complete brand overhaul or a cutting-edge digital experience, we're here to turn your vision into reality.
        </p>
        
        <div className="cta-elem flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/contact" 
            className="group flex items-center gap-3 px-8 py-4 bg-[#C3143D] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(195,20,61,0.4)]"
          >
            Start Your Project
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link 
            href="/contact" 
            className="group px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            Schedule a Call
          </Link>
        </div>
      </div>
    </section>
  )
}
