"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// ── SWEET ANIMATION: Staggered Letter Reveal on Hover ──
const AnimatedLink = ({ text, href, external = false }: { text: string, href: string, external?: boolean }) => {
  const content = (
    <span className="relative flex overflow-hidden">
      {text.split('').map((char, i) => (
        <span key={i} className="relative inline-block whitespace-pre">
          <span 
            className="inline-block transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:-translate-y-full" 
            style={{ transitionDelay: `${i * 20}ms` }}
          >
            {char}
          </span>
          <span 
            className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0 text-white font-medium" 
            style={{ transitionDelay: `${i * 20}ms` }}
          >
            {char}
          </span>
        </span>
      ))}
      {external && <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C3143D] self-center" />}
    </span>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group text-white/50 hover:text-white transition-colors duration-300 font-light text-sm cursor-none flex items-center" data-cursor="Open">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="group text-white/50 hover:text-white transition-colors duration-300 font-light text-sm cursor-none flex items-center" data-cursor="Go">
      {content}
    </Link>
  )
}

export function Footer() {
  const { isArabic } = useLanguage()

  const menuLinks = [
    { name: isArabic ? "من نحن" : "About Us", href: "/about" },
    { name: isArabic ? "خدماتنا" : "Our Services", href: "/services" },
    { name: isArabic ? "معرض الأعمال" : "Portfolio", href: "/portfolio" },
    { name: isArabic ? "اتصل بنا" : "Contact", href: "/contact" },
  ]

  const socials = [
    { name: "Facebook", href: "https://facebook.com/revoagency" },
    { name: "Instagram", href: "https://instagram.com/revoagency" },
    { name: "LinkedIn", href: "https://linkedin.com/company/revoagency" },
  ]

  return (
    <footer className="bg-[#050505] pt-24 pb-10 relative overflow-hidden border-t border-white/5 z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          
          {/* ── LEFT: BRANDING & CONTACT ── */}
          <div className="flex flex-col max-w-sm">
            <Link href="/" className="inline-block mb-6 cursor-none group" data-cursor="Revo">
              <img
                src="/images/revo-logo.png"
                alt="REVO Media Production"
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-8">
              {isArabic
                ? "وكالة إنتاج إعلامي وسينمائي تصنع تجارب بصرية مبهرة وتبني هويات استثنائية."
                : "A creative digital agency engineering immersive experiences and building brand empires."}
            </p>
            <a href="mailto:hello@revo.com" className="group inline-flex items-center gap-4 text-white/70 hover:text-white transition-colors text-lg font-light cursor-none w-fit" data-cursor="Email">
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">hello@revo.com</span>
                <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#C3143D]">hello@revo.com</span>
              </span>
            </a>
          </div>

          {/* ── RIGHT: NAVIGATION ── */}
          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
                {isArabic ? "روابط سريعة" : "Navigation"}
              </span>
              <ul className="flex flex-col gap-4">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <AnimatedLink text={link.name} href={link.href} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
                {isArabic ? "تواصل معنا" : "Socials"}
              </span>
              <ul className="flex flex-col gap-4">
                {socials.map((link) => (
                  <li key={link.name}>
                    <AnimatedLink text={link.name} href={link.href} external />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: COPYRIGHT ── */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-white/30 text-[10px] md:text-xs font-light uppercase tracking-widest">
            {isArabic
              ? `© ${new Date().getFullYear()} وكالة ريفو. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Revo Agency. All rights reserved.`}
          </span>
          <div className="flex items-center gap-6 text-white/30 text-[10px] md:text-xs font-light uppercase tracking-widest">
            <AnimatedLink text={isArabic ? "سياسة الخصوصية" : "Privacy Policy"} href="/privacy" />
            <AnimatedLink text={isArabic ? "شروط الخدمة" : "Terms of Service"} href="/terms" />
          </div>
        </div>

      </div>
    </footer>
  )
}
