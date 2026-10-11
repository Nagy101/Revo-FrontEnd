"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const services = [
  {
    title: 'Photography',
    titleAr: 'التصوير الفوتوغرافي',
    description: 'Corporate, product, fashion, events, and lifestyle photography with artistic precision and professional excellence.',
    descriptionAr: 'تصوير احترافي للفعاليات، الحفلات، جلسات الفنانين، وتوثيق المنتجات بدقة فنية وجودة سينمائية.',
    image: '/images/revo-services-card1.jpg', 
  },
  {
    title: 'Cinematics',
    titleAr: 'الإنتاج السينمائي والكليبات',
    description: 'Commercial ads, brand videos, social media reels, and event coverage that tells your story with cinematic impact.',
    descriptionAr: 'إعلانات تجارية كبرى، كليبات موسيقية، وتغطية حفلات ضخمة تروي قصتك بتأثير وإخراج سينمائي مبهر.',
    image: '/images/revo-portfolio-card1.jpg', 
  },
  {
    title: 'Social Media',
    titleAr: 'محتوى السوشيال ميديا',
    description: 'Tailored visuals for Instagram, Facebook, and TikTok designed to maximize engagement and reach global audiences.',
    descriptionAr: 'صناعة محتوى مرئي وفيديوهات ريلز مخصصة لتحقيق أعلى انتشار وتفاعل عبر كافة المنصات الرقمية.',
    image: '/images/revo-services-card2.jpg',
  },
  {
    title: 'Campaigns',
    titleAr: 'الحملات الإعلانية المتكاملة',
    description: 'Full-service media strategies for brands with comprehensive creative direction and campaign development.',
    descriptionAr: 'استراتيجيات إعلامية متكاملة للعلامات التجارية مع إدارة فنية وإخراج إبداعي شامل للحملة من البداية للنهاية.',
    image: '/images/revo-portfolio-card2.jpg',
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const { isArabic } = useLanguage()

  return (
    <section className="py-20 md:py-32 bg-[#050505] relative border-t border-white/5">
      
      {/* ── BACKGROUND GLOW ── */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#C3143D]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* ── LEFT COLUMN (STICKY INTRO) ── */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between lg:h-[800px] lg:sticky lg:top-32">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-[#C3143D]" />
              <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
                {isArabic ? "قدراتنا وخبراتنا" : "Our Expertise"}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-sora font-light uppercase text-white leading-tight tracking-widest mb-6"
            >
              {isArabic ? (
                <>
                  نصنع <br/>
                  <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 pr-4">
                    التأثير السينمائي
                  </span>
                </>
              ) : (
                <>
                  We create <br/>
                  <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 pr-4">
                    Impact
                  </span>
                </>
              )}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-white/40 max-w-sm text-sm md:text-base font-light leading-relaxed"
            >
              {isArabic 
                ? "نقدم منظومة شاملة من الخدمات الإبداعية المصممة لترقية علامتك التجارية وربطها بالجمهور بشغف واحترافية مطلقة."
                : "We offer a comprehensive suite of creative services designed to elevate your brand and connect with your audience on a visceral level."
              }
            </motion.p>
          </div>

          {/* DYNAMIC IMAGE REVEAL CONTAINER (DESKTOP ONLY) */}
          <div className="hidden lg:block w-full h-[45%] mt-auto relative rounded-3xl overflow-hidden group shadow-2xl">
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
                  src={services[hoveredIndex].image} 
                  alt={services[hoveredIndex].title}
                  fill
                  className="object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-[2s]"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* ── RIGHT COLUMN (SCROLLING LIST) ── */}
        <div className="w-full lg:w-7/12 flex flex-col pt-10 lg:pt-0">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              onMouseEnter={() => setHoveredIndex(index)}
              initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group py-12 md:py-16 border-b border-white/10 hover:border-white/30 transition-colors duration-500 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#C3143D] tracking-widest">
                  [ 0{index + 1} ]
                </span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-sora font-semibold text-white tracking-wide mb-4 group-hover:translate-x-4 rtl:group-hover:-translate-x-4 transition-transform duration-500">
                {isArabic ? service.titleAr : service.title}
              </h3>
              
              <p className="text-white/40 text-sm md:text-base font-light max-w-xl leading-relaxed">
                {isArabic ? service.descriptionAr : service.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
