"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])

  return (
    <section 
      ref={containerRef} 
      className="py-32 md:py-48 bg-[#050505] relative overflow-hidden flex items-center justify-center min-h-[70vh] border-t border-white/5"
    >
      {/* ── SUBTLE ELEGANT GLOW ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C3143D]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        style={{ y, opacity }} 
        className="relative z-10 flex flex-col items-center text-center w-full px-6 max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-[#C3143D]" />
          <span className="text-[#C3143D] font-bold uppercase tracking-[0.3em] text-xs">
            Start a new chapter
          </span>
          <div className="w-12 h-px bg-[#C3143D]" />
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-[7rem] font-sora font-light text-white leading-tight tracking-tight mb-8">
          Have an idea? <br/>
          <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Let's build it.</span>
        </h2>
        
        <p className="text-white/40 text-sm md:text-lg font-light max-w-2xl mx-auto mb-16 leading-relaxed">
          Whether you need a complete brand overhaul or a cutting-edge digital experience, we're here to turn your vision into a masterpiece.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
          <Link href="/contact">
            <button className="group relative px-10 py-5 bg-transparent border border-white/20 rounded-full overflow-hidden hover:border-[#C3143D] transition-colors duration-500 cursor-none" data-cursor="Start">
              <div className="absolute inset-0 w-full h-full bg-[#C3143D] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <span className="relative text-white group-hover:text-white font-medium uppercase tracking-[0.2em] text-xs transition-colors duration-500 flex items-center gap-4">
                Let's Talk <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-500" />
              </span>
            </button>
          </Link>
          
          <a href="mailto:hello@revo.com" className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors duration-500">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors duration-500">
              <Mail size={16} />
            </div>
            <span className="font-medium tracking-widest text-xs uppercase">hello@revo.com</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
