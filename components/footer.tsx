"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

// ── SWEET ANIMATION: Smooth Reveal on Hover ──
const AnimatedLink = ({ text, href, external = false }: { text: string, href: string, external?: boolean }) => {
  const content = (
    <span className="relative flex items-center overflow-hidden" dir="ltr">
      {text.split('').map((char, i) => (
        <span key={i} className="relative inline-block whitespace-pre">
          <span 
            className="inline-block transition-transform duration-500 ease-cinematic group-hover:-translate-y-full" 
            style={{ transitionDelay: `${i * 20}ms` }}
          >
            {char}
          </span>
          <span 
            className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 ease-cinematic group-hover:translate-y-0 text-white font-medium" 
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
  const menuLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ]

  const socials = [
    { name: "Instagram", href: "https://www.instagram.com/revomedia.eg?obrf=N3cwbGZhdzJ6cWM0" },
  ]

  return (
    <footer className="bg-[#050505] pt-24 pb-10 relative overflow-hidden border-t border-white/5 z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          
          {/* ── LEFT: BRANDING & CONTACT ── */}
          <div className="flex flex-col max-w-sm">
            <Link href="/" className="inline-block mb-6 cursor-none group" data-cursor="Revo">
              <Image
                src="/images/revo-logo.png"
                alt="REVO Media Production"
                width={130}
                height={52}
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
              A creative digital agency engineering immersive experiences and building brand empires.
            </p>

            <div className="flex flex-col gap-3">
              {/* Email */}
              <a href="mailto:revo.media.eg@gmail.com" className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors text-base font-light w-fit">
                <span className="text-[#C3143D] text-sm">✉</span>
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">revo.media.eg@gmail.com</span>
                  <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#C3143D]">revo.media.eg@gmail.com</span>
                </span>
              </a>

              {/* Phone */}
              <a href="tel:+201064102972" className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors text-base font-light font-mono w-fit dir-ltr">
                <span className="text-[#C3143D] text-sm">✆</span>
                <span>+20 106 410 2972</span>
              </a>

              {/* Location */}
              <div className="inline-flex items-center gap-3 text-white/50 text-sm font-light">
                <span className="text-[#C3143D] text-sm">📍</span>
                <span>New Cairo</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: NAVIGATION ── */}
          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
                Navigation
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
                Socials
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
            {`© ${new Date().getFullYear()} REVO Media Production. All rights reserved.`}
          </span>
          <span className="text-white/40 text-[10px] md:text-xs font-mono tracking-widest uppercase">
            New Cairo
          </span>
        </div>

      </div>
    </footer>
  )
}
