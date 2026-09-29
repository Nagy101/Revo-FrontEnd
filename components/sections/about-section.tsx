"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Play } from "lucide-react"

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax for the massive image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  
  // Staggered reveal variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } }
  }

  const stats = [
    { label: "Years of Excellence", value: "10+" },
    { label: "Global Partners", value: "150+" },
    { label: "Industry Awards", value: "24" },
    { label: "Client Retention", value: "98%" },
  ]

  return (
    <section ref={containerRef} className="pt-10 md:pt-20 pb-32 md:pb-48 bg-[#050505] relative overflow-hidden">
      
      {/* ── AMBIENT GLOW ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C3143D]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* ── MANIFESTO HEADER (LUXURY REVEAL) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
            <div className="w-12 h-px bg-[#C3143D]" />
            <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
              The Manifesto
            </span>
            <div className="w-12 h-px bg-[#C3143D]" />
          </motion.div>
          
          <div className="text-4xl md:text-6xl lg:text-[6rem] font-sora font-light uppercase text-white/90 leading-[1.1] mb-12 tracking-tight flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block">
                We don't just build.
              </motion.span>
            </div>
            <div className="overflow-hidden mt-2 md:mt-4">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#C3143D] to-red-400 pr-4">
                We engineer
              </motion.span>
            </div>
            <div className="overflow-hidden mt-2 md:mt-4">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } }} className="block">
                digital empires.
              </motion.span>
            </div>
          </div>

          <motion.p variants={itemVariants} className="text-white/50 text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-24">
            REVO is a collective of visionaries, strategists, and creators. We transcend traditional boundaries to craft immersive digital experiences that elevate brands, disrupt industries, and leave a lasting legacy.
          </motion.p>
        </motion.div>

        {/* ── CINEMATIC IMAGE/VIDEO CONTAINER ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
          className="w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden relative group cursor-pointer shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          data-cursor="Play"
        >
          <motion.div style={{ y: imageY, height: "130%" }} className="absolute inset-0 w-full top-[-15%]">
            <Image 
              src="/images/auth-bg.jpg" 
              alt="REVO Behind the Scenes" 
              fill 
              className="object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-60 grayscale-[30%]"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-[#050505]/20 group-hover:bg-transparent transition-colors duration-700" />
          
          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-[#C3143D]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Play className="w-8 h-8 md:w-12 md:h-12 text-white ml-2" fill="currentColor" />
            </div>
          </div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-24 pt-16 border-t border-white/5"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex flex-col items-center md:items-start text-center md:text-left cursor-default group"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl font-sora font-light text-white mb-4 group-hover:text-[#C3143D] transition-colors duration-500">
                {stat.value}
              </span>
              <span className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors duration-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
