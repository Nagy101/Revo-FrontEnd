"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { usePublicClients } from "../hooks/useClients"

export function ClientsSection() {
  const { data: clients = [], isLoading } = usePublicClients()

  const marqueeItems = useMemo(() => {
    if (!clients || clients.length === 0) return []
    let duplicated = [...clients]
    while (duplicated.length < 10) {
      duplicated = [...duplicated, ...clients]
    }
    return [...duplicated, ...duplicated]
  }, [clients])

  if (isLoading || clients.length === 0) return null

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] bg-[#050505] overflow-hidden flex flex-col items-center justify-center z-20 py-20">
      
      {/* ── BACKGROUND GLOW ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#C3143D]/5 to-[#050505] pointer-events-none" />

      {/* ── OUTLINE BACKGROUND MARQUEE (Right Scrolling) ── */}
      <div className="absolute top-[20%] md:top-[15%] left-[-10%] right-[-10%] w-[120%] transform rotate-[4deg] md:rotate-[3deg] flex items-center overflow-hidden opacity-20 pointer-events-none z-0 will-change-transform">
        <motion.div 
          animate={{ x: ["-50%", "0%"] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center w-max gap-8 whitespace-nowrap will-change-transform"
        >
          {[...Array(10)].map((_, i) => (
            <span 
              key={i} 
              className="text-[5rem] md:text-[8rem] font-sora font-black uppercase text-transparent" 
              style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
            >
              GLOBAL VISIONARIES ✦
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── MAIN CRIMSON MARQUEE (Left Scrolling) ── */}
      <div className="absolute top-[40%] md:top-[35%] left-[-10%] right-[-10%] w-[120%] h-24 md:h-36 bg-[#C3143D] border-y border-white/20 transform -rotate-[4deg] md:-rotate-[3deg] flex items-center overflow-hidden z-10 will-change-transform">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center w-max gap-8 md:gap-16 pl-8 md:pl-16 will-change-transform"
        >
          {marqueeItems.map((client, index) => {
            const hasRealLogo = client.logoUrl && !client.logoUrl.includes("placeholder")
            return (
              <div key={`${client.id}-${index}`} className="flex items-center gap-8 md:gap-16">
                
                {/* Prefix Text */}
                <span className="text-white/90 font-sora font-bold uppercase tracking-[0.2em] text-base md:text-2xl whitespace-nowrap">
                  Trusted By
                </span>
                
                {/* Logo or Typographic Fallback */}
                <div className="flex items-center justify-center">
                  {hasRealLogo ? (
                    <div className="relative h-10 md:h-16 w-32 md:w-48 transition-transform duration-500 hover:scale-110 hover:brightness-110 cursor-pointer">
                      <Image
                        src={client.logoUrl}
                        alt={client.name}
                        fill
                        sizes="(max-width: 768px) 128px, 192px"
                        className="object-contain brightness-0 invert opacity-100"
                      />
                    </div>
                  ) : (
                    <span className="text-white font-serif italic text-3xl md:text-5xl whitespace-nowrap px-4 transition-transform duration-500 hover:scale-105 cursor-pointer">
                      {client.name}
                    </span>
                  )}
                </div>
                
                {/* Separator */}
                <span className="text-white/50 text-xl md:text-3xl">✦</span>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Fade Gradients for the whole section edges */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-30" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-30" />

    </section>
  )
}
