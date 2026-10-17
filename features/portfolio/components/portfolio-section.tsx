"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Play, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { usePublicPortfolios } from "../hooks/usePortfolios"
import { useLanguage } from "@/lib/i18n/language-context"

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { isArabic } = useLanguage()
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  // Subtle parallax effect for the image inside the card
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  
  // Bespoke gallery layout for the 3 items
  const layouts = [
    {
      direction: "md:flex-row",
      imgWidth: "md:w-[55%]",
      textWidth: "md:w-[35%]",
      aspect: "aspect-[4/3] md:aspect-[16/10]",
      justify: "md:justify-between"
    },
    {
      direction: "md:flex-row-reverse",
      imgWidth: "md:w-[40%]",
      textWidth: "md:w-[45%]",
      aspect: "aspect-[4/5] md:aspect-[3/4]",
      justify: "md:justify-around"
    },
    {
      direction: "md:flex-row",
      imgWidth: "md:w-[50%]",
      textWidth: "md:w-[40%]",
      aspect: "aspect-[16/9] md:aspect-[4/3]",
      justify: "md:justify-between"
    }
  ]

  const layout = layouts[index] || layouts[0]

  const projectTitle = (
    isArabic
      ? project.captionAr || project.captionEn || "مشروع سينمائي"
      : project.captionEn || project.captionAr || "Cinematic Project"
  ).trim()

  const projectCategory = (
    isArabic
      ? project.categoryNameAr || project.categoryNameEn || "عمل مميز"
      : project.categoryNameEn || project.categoryNameAr || "Featured Work"
  ).trim()

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col ${layout.direction} ${layout.justify} gap-8 md:gap-12 items-center w-full my-16 md:my-24`}
    >
      {/* ── IMAGE CONTAINER ── */}
      <Link href={`/portfolio/${project.id}`} className="w-full block contents">
        <div 
          data-cursor="View"
          className={`w-full ${layout.imgWidth} relative ${layout.aspect} overflow-hidden rounded-2xl bg-[#0a0a0a] group shadow-2xl cursor-none`}
        >
          <motion.div style={{ y, height: "120%" }} className="absolute inset-0 w-full top-[-10%]">
            <Image
              src={project.thumbnailUrl || "/images/revo-hero-bg.jpg"}
              alt={projectTitle}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-1500 ease-cinematic group-hover:scale-105"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-[#050505]/10 group-hover:bg-transparent transition-colors duration-700" />
          
          {project.thumbnailType === 2 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#C3143D]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* ── INFO CONTAINER ── */}
      <div className={`w-full ${layout.textWidth} flex flex-col justify-center relative z-10`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.2em]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="w-8 h-px bg-white/20" />
          <span className="text-white/50 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em]">
            {projectCategory}
          </span>
        </div>
        
        <h3 className="text-2xl md:text-4xl font-sora font-semibold uppercase text-white/90 mb-8 leading-tight tracking-wide">
          {projectTitle}
        </h3>

        <Link href={`/portfolio/${project.id}`}>
          <button className="group flex items-center gap-4 w-max cursor-pointer">
            <span className="text-white/80 font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs transition-colors duration-500 group-hover:text-white">
              {isArabic ? "استكشف المشروع" : "Explore Project"}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
              <ArrowUpRight className="text-white/50 w-4 h-4 group-hover:rotate-45 rtl:group-hover:-rotate-45 group-hover:text-black transition-all duration-500" />
            </div>
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

const DEFAULT_FEATURED_PROJECTS = [
  {
    id: "cairokee-empire",
    captionEn: "Cairokee Empire Festival",
    captionAr: "مهرجان إمبراطورية كايروكي",
    categoryNameEn: "Cinematic Event Coverage",
    categoryNameAr: "تغطية سينمائية للفعاليات",
    thumbnailUrl: "/images/revo-hero-bg.jpg",
    thumbnailType: 2,
  },
  {
    id: "acoustic-sessions",
    captionEn: "Acoustic Sunset Sessions",
    captionAr: "جلسات غروب الشمس الأكوستيك",
    categoryNameEn: "Live Music & Visual Stories",
    categoryNameAr: "موسيقى لايف وقصص بصرية",
    thumbnailUrl: "/images/revo-band.jpg",
    thumbnailType: 1,
  },
  {
    id: "arena-live",
    captionEn: "Reda Elbahrawy — Arena Live",
    captionAr: "رضا البحراوي — أرينا لايف",
    categoryNameEn: "Mega Concert Production",
    categoryNameAr: "إنتاج أضخم الحفلات",
    thumbnailUrl: "/images/revo-singer.jpg",
    thumbnailType: 2,
  },
]

export function PortfolioSection() {
  const { data: portfolios = [], isLoading } = usePublicPortfolios()
  const { isArabic } = useLanguage()

  // Use API items if available, otherwise use high-production curated fallback
  const featuredPortfolios = (portfolios && portfolios.length > 0)
    ? portfolios.slice(0, 3).map((p: any) => ({
        id: p.id,
        captionEn: p.captionEn || p.titleEn || "Cinematic Story",
        captionAr: p.captionAr || p.titleAr,
        categoryNameEn: p.categoryNameEn || p.category?.nameEn || "Featured Work",
        categoryNameAr: p.categoryNameAr || p.category?.nameAr || "أعمال مميزة",
        thumbnailUrl: p.thumbnailUrl || p.mediaUrl || "/images/revo-hero-bg.jpg",
        thumbnailType: p.thumbnailType ?? (p.mediaType === "video" ? 2 : 1),
      }))
    : DEFAULT_FEATURED_PROJECTS

  return (
    <section className="py-20 md:py-32 bg-[#050505] relative overflow-hidden">
      
      {/* ── BACKGROUND GLOW ── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-[#C3143D]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24 border-b border-white/5 pb-12">
          <div className="flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-px bg-[#C3143D]" />
              <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
                {isArabic ? "معرض الأعمال" : "Portfolio"}
              </span>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              <div className="overflow-hidden">
                <motion.h2 
                  variants={{ hidden: { y: "100%" }, show: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                  className="text-3xl md:text-5xl lg:text-[4rem] font-sora font-light uppercase text-white/90 leading-none tracking-widest"
                >
                  {isArabic ? "مختارات من" : "Selected"}
                </motion.h2>
              </div>
              <div className="overflow-hidden mt-1 md:mt-2">
                <motion.h2 
                  variants={{ hidden: { y: "100%" }, show: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                  className="text-3xl md:text-5xl lg:text-[5rem] font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] leading-none pr-4"
                >
                  {isArabic ? "روائع أعمالنا." : "Masterpieces."}
                </motion.h2>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex items-center gap-6"
          >
            <p className="text-white/40 max-w-xs text-xs md:text-sm font-light leading-relaxed hidden lg:block">
              {isArabic
                ? "مختارات منتقاة من أبرز أعمالنا، تجمع بين الرؤية الاستراتيجية والتنفيذ السينمائي المتقن."
                : "A curated selection of our finest work, blending visionary strategy with flawless execution."}
            </p>
          </motion.div>
        </div>

        {/* ── GALLERY ── */}
        <div className="flex flex-col w-full relative">
          {featuredPortfolios.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* ── VIEW ALL BUTTON ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 flex justify-center w-full"
        >
          <Link href="/portfolio">
            <button className="group relative px-10 py-5 bg-transparent border border-white/10 rounded-full overflow-hidden hover:border-white/30 transition-colors duration-500 cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-cinematic" />
              <span className="relative text-white/80 group-hover:text-white font-medium uppercase tracking-[0.3em] text-xs transition-colors duration-500 flex items-center gap-4">
                {isArabic ? "عرض جميع المشاريع" : "View All Projects"}{" "}
                <ArrowUpRight size={14} className="rtl:rotate-180" />
              </span>
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
