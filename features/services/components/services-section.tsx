"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { usePublicServices } from "../hooks/useServices"

// Fallback images based on index
const fallbackImages = [
  '/images/agency_hero_bg.jpg',
  '/images/auth-bg.jpg',
  '/images/agency_hero_bg.jpg',
]

export function ServicesSection() {
  const { data: services = [], isLoading } = usePublicServices()
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  if (isLoading) {
    return (
      <section className="py-24 bg-[#050505] min-h-[600px] flex items-center justify-center border-t border-white/5">
        <div className="w-10 h-10 border-2 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
      </section>
    )
  }

  if (services.length === 0) return null

  // ONLY SHOW 3 SERVICES MAX
  const featuredServices = services.slice(0, 3)

  return (
    <section className="py-20 md:py-32 bg-[#050505] relative border-t border-white/5 overflow-hidden">
      
      {/* ── BACKGROUND GLOW ── */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#C3143D]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* ── LEFT COLUMN (STICKY) ── */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-32 h-auto lg:h-[calc(100vh-160px)] flex flex-col justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-[#C3143D]" />
              <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
                Our Expertise
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-sora font-light uppercase text-white leading-tight tracking-widest mb-6"
            >
              We create <br/>
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 pr-4">Impact</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-white/40 max-w-sm text-sm md:text-base font-light leading-relaxed"
            >
              We offer a comprehensive suite of creative services designed to elevate your brand and connect with your audience on a visceral level.
            </motion.p>
          </div>

          {/* DYNAMIC IMAGE REVEAL CONTAINER (DESKTOP ONLY) */}
          <div className="hidden lg:block w-full h-[45%] mt-auto relative rounded-3xl overflow-hidden group shadow-2xl" data-cursor="View">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image 
                  src={featuredServices[hoveredIndex]?.imageUrl || fallbackImages[hoveredIndex] || fallbackImages[0]} 
                  alt={featuredServices[hoveredIndex]?.nameEn || "Service"}
                  fill
                  className="object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-[2s]"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── RIGHT COLUMN (SCROLLING LIST) ── */}
        <div className="w-full lg:w-7/12 flex flex-col pt-10 lg:pt-0">
          {featuredServices.map((service, index) => (
            <Link key={service.id} href={`/services/${service.id}`} className="contents block">
              <motion.div
                onMouseEnter={() => setHoveredIndex(index)}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group py-12 md:py-20 border-b border-white/10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-center cursor-none"
                data-cursor="Discover"
              >
                <span className="text-[#C3143D] text-lg md:text-xl font-sora font-medium opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                <div className="flex-1">
                  <h3 className="text-3xl md:text-5xl font-sora font-light uppercase text-white/80 group-hover:text-white group-hover:translate-x-4 transition-all duration-500 mb-4 tracking-wider">
                    {service.nameEn}
                  </h3>
                  <p className="text-white/40 text-sm md:text-base font-light leading-relaxed max-w-lg group-hover:text-white/60 transition-colors duration-500 group-hover:translate-x-4">
                    {service.descriptionEn}
                  </p>
                </div>

                <div className="hidden md:flex w-16 h-16 rounded-full border border-white/10 items-center justify-center group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-500 shrink-0">
                  <ArrowUpRight className="text-white/30 group-hover:text-white group-hover:rotate-45 transition-all duration-500 w-6 h-6" />
                </div>
              </motion.div>
            </Link>
          ))}

          {/* VIEW ALL SERVICES BUTTON */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20 flex justify-center w-full"
          >
            <Link href="/services#all-services">
              <button className="group relative px-10 py-5 bg-transparent border border-white/10 rounded-full overflow-hidden hover:border-white/30 transition-colors duration-500 cursor-none" data-cursor="View All">
                <div className="absolute inset-0 w-full h-full bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                <span className="relative text-white/80 group-hover:text-white font-medium uppercase tracking-[0.3em] text-xs transition-colors duration-500 flex items-center gap-4">
                  View All Services <ArrowUpRight size={14} />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
