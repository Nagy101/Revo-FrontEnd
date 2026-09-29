"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const footerLinks = {
  menu: [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ],
  socials: [
    { name: "Facebook", href: "https://facebook.com/revoagency" },
    { name: "Instagram", href: "https://instagram.com/revoagency" },
    { name: "LinkedIn", href: "https://linkedin.com/company/revoagency" },
  ],
}

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
  return (
    <footer className="bg-[#050505] pt-24 pb-10 relative overflow-hidden border-t border-white/5 z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          
          {/* ── LEFT: BRANDING & CONTACT ── */}
          <div className="flex flex-col max-w-sm">
            <Link href="/" className="inline-block mb-6 cursor-none" data-cursor="Revo">
              <span className="text-3xl font-sora font-black tracking-widest text-white">REVO<span className="text-[#C3143D]">.</span></span>
            </Link>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-8">
              A creative digital agency engineering immersive experiences and building brand empires.
            </p>
            <a href="mailto:hello@revoagency.com" className="group inline-flex items-center gap-4 text-white/70 hover:text-white transition-colors text-lg font-light cursor-none w-fit" data-cursor="Email">
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">hello@revo.com</span>
                <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#C3143D]">hello@revo.com</span>
              </span>
            </a>
          </div>

          {/* ── RIGHT: NAVIGATION ── */}
          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">Navigation</span>
              <ul className="flex flex-col gap-4">
                {footerLinks.menu.map((link) => (
                  <li key={link.name}>
                    <AnimatedLink text={link.name} href={link.href} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">Socials</span>
              <ul className="flex flex-col gap-4">
                {footerLinks.socials.map((link) => (
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
            © {new Date().getFullYear()} Revo Agency. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-white/30 text-[10px] md:text-xs font-light uppercase tracking-widest">
            <AnimatedLink text="Privacy Policy" href="/privacy" />
            <AnimatedLink text="Terms of Service" href="/terms" />
          </div>
        </div>

      </div>
    </footer>
  )
}
