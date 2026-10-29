"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight, Phone, Instagram, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { t, locale, isArabic } = useLanguage()
  const lastToggleRef = useRef(0)

  const navItems = [
    { num: "01", name: t("nav_home"), href: "/" },
    { num: "02", name: t("nav_about"), href: "/about" },
    { num: "03", name: t("nav_services"), href: "/services" },
    { num: "04", name: t("nav_portfolio"), href: "/portfolio" },
    { num: "05", name: t("nav_contact"), href: "/contact" },
  ]

  // Track hydration for createPortal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-logout when accessing main navigation from admin
  useEffect(() => {
    const wasInAdmin = sessionStorage.getItem("was-in-admin")
    if (wasInAdmin) {
      localStorage.removeItem("admin-authenticated")
      sessionStorage.removeItem("was-in-admin")
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // GPU & Frame-budgeted Scroll Tracking (Zero Touch Contention)
  useEffect(() => {
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 30
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev))
          rafId = null
        })
      }
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname])

  // Instant Touch Handlers (0ms response, debounced against phantom clicks)
  const handleToggleMenu = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    const now = Date.now()
    if (now - lastToggleRef.current < 250) return
    lastToggleRef.current = now
    setIsOpen(prev => !prev)
  }

  const handleCloseMenu = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation()
    const now = Date.now()
    if (now - lastToggleRef.current < 250) return
    lastToggleRef.current = now
    setIsOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/20 backdrop-blur-md border-b border-white/10 py-0"
            : "bg-transparent border-b border-transparent py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8" dir="ltr">
          <div className="relative flex items-center justify-between h-20">
            {/* Logo (Left) */}
            <div className="flex items-center z-10">
              <Link href="/" className="flex items-center group py-2" onClick={handleCloseMenu}>
                <Image
                  src="/images/revo-logo.png"
                  alt="REVO Media Production"
                  width={110}
                  height={44}
                  priority
                  className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Navigation (Perfect Center Anchor) */}
            <div className="hidden lg:flex items-center gap-7 xl:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-primary whitespace-nowrap ${
                    pathname === item.href ? "text-primary font-semibold" : "text-foreground/80"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions (Quote & Language on Right) */}
            <div className="hidden lg:flex items-center gap-3.5 z-10">
              <LanguageSwitcher />
              <div className="w-px h-5 bg-white/10" />
              <Button asChild className="btn-primary">
                <Link href="/contact">{t("nav_quote")}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button & Language Switcher (Instant Touch Response) */}
            <div className="lg:hidden flex items-center gap-2.5 z-10">
              <LanguageSwitcher />
              <button
                type="button"
                onPointerDown={handleToggleMenu}
                onClick={handleToggleMenu}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-[#C3143D]/50 hover:bg-[#C3143D]/10 flex items-center justify-center text-foreground hover:text-primary transition-all cursor-pointer active:scale-95 touch-manipulation select-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Full-Screen Overlay Portaled to document.body */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 999999,
                touchAction: "pan-y"
              }}
              className="lg:hidden bg-[#050505] flex flex-col justify-between overflow-y-auto"
            >
              {/* Top Header inside overlay matching main nav layout */}
              <div className="w-full px-6 sm:px-8 border-b border-white/10 bg-[#050505] shrink-0 sticky top-0 z-30" dir="ltr">
                <div className="flex items-center justify-between h-20">
                  <Link href="/" className="flex items-center py-2" onClick={handleCloseMenu}>
                    <Image
                      src="/images/revo-logo.png"
                      alt="REVO Media Production"
                      width={110}
                      height={44}
                      priority
                      className="h-10 sm:h-11 w-auto object-contain"
                    />
                  </Link>
                  <div className="flex items-center gap-2.5">
                    <LanguageSwitcher />
                    <button
                      type="button"
                      onPointerDown={handleCloseMenu}
                      onClick={handleCloseMenu}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-[#C3143D] hover:bg-[#C3143D]/15 flex items-center justify-center text-white/90 hover:text-[#C3143D] transition-all cursor-pointer active:scale-95 touch-manipulation z-30 select-none"
                      aria-label="Close menu"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Background Ambient Crimson Accents */}
              <div 
                className="absolute top-20 right-0 w-72 h-72 rounded-full pointer-events-none opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(195, 20, 61, 0.35) 0%, transparent 70%)' }}
              />
              <div 
                className="absolute bottom-20 left-0 w-72 h-72 rounded-full pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(195, 20, 61, 0.3) 0%, transparent 70%)' }}
              />

              {/* Main Menu Links Section */}
              <div
                className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 py-6 max-w-md mx-auto w-full"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <div className="space-y-2.5">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleCloseMenu}
                          className={`group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 border ${
                            isActive
                              ? "bg-white/[0.06] border-[#C3143D]/40 text-white shadow-[0_0_25px_rgba(195,20,61,0.2)]"
                              : "bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/[0.03] hover:border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${
                                isActive
                                  ? "bg-[#C3143D] text-white shadow-[0_0_12px_rgba(195,20,61,0.6)]"
                                  : "bg-white/5 text-white/40 group-hover:text-white/70 group-hover:bg-white/10"
                              }`}
                            >
                              {item.num}
                            </span>
                            <span
                              className={`text-xl sm:text-2xl font-sora tracking-tight transition-all ${
                                isActive ? "font-bold text-white" : "font-medium group-hover:translate-x-1"
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isActive ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#C3143D] shadow-[0_0_10px_#C3143D] animate-pulse" />
                            ) : (
                              <ArrowUpRight
                                className={`w-4 h-4 text-white/20 group-hover:text-[#C3143D] transition-all transform ${
                                  isArabic ? "rotate-[-90deg]" : ""
                                } group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                              />
                            )}
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>

                {/* Primary CTA Button */}
                <div className="pt-6 w-full">
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#C3143D] via-[#D81B48] to-[#C3143D] hover:from-white hover:to-white hover:text-black text-white font-sora font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(195,20,61,0.4)] transition-all duration-300 group"
                    onClick={handleCloseMenu}
                  >
                    <Link href="/contact" className="flex items-center justify-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-white/90 group-hover:text-black transition-colors" />
                      <span>{t("nav_quote")}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Bottom Quick Contacts & Agency Info Strip */}
              <div className="relative z-10 w-full px-6 py-4 border-t border-white/10 bg-[#070707] shrink-0" dir="ltr">
                <div className="max-w-md mx-auto flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <a
                      href="https://www.instagram.com/revomedia.eg?obrf=N3cwbGZhdzJ6cWM0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#C3143D]/60 hover:bg-[#C3143D]/10 transition-all text-xs font-medium"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#C3143D]" />
                      <span>@revomedia.eg</span>
                    </a>
                    <a
                      href="tel:+201064102972"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#C3143D]/60 hover:bg-[#C3143D]/10 transition-all text-xs font-mono"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C3143D]" />
                      <span>01064102972</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40 font-mono text-center">
                    <MapPin className="w-3 h-3 text-[#C3143D] shrink-0" />
                    <span>New Cairo 1, Cairo, Egypt</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
