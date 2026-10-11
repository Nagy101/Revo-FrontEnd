"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { name: t("nav_home"), href: "/" },
    { name: t("nav_about"), href: "/about" },
    { name: t("nav_services"), href: "/services" },
    { name: t("nav_portfolio"), href: "/portfolio" },
    { name: t("nav_contact"), href: "/contact" },
  ]

  // Auto-logout when accessing main navigation from admin
  useEffect(() => {
    const wasInAdmin = sessionStorage.getItem("was-in-admin")
    if (wasInAdmin) {
      localStorage.removeItem("admin-authenticated")
      sessionStorage.removeItem("was-in-admin")
      console.log("Auto-logout: Accessed main navigation from admin")
    }
  }, [])

  // Reset scroll state on route change & track scroll
  useEffect(() => {
    setScrolled(window.scrollY > 50)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-0" : "bg-transparent border-b border-transparent py-2"}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8" dir="ltr">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo (Left) */}
          <div className="flex items-center z-10">
            <Link href="/" className="flex items-center group py-2" onClick={closeMenu}>
              <img
                src="/images/revo-logo.png"
                alt="REVO Media Production"
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

          {/* Mobile Menu Button & Language Switcher */}
          <div className="lg:hidden flex items-center gap-3 z-10">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-background/95 backdrop-blur-md z-40">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <Link href="/" onClick={closeMenu} className="mb-2">
              <img
                src="/images/revo-logo.png"
                alt="REVO Media Production"
                className="h-12 w-auto object-contain"
              />
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 text-xl font-medium transition-colors duration-200 hover:text-primary ${
                  pathname === item.href ? "text-primary font-bold" : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild size="lg" className="btn-primary px-8" onClick={closeMenu}>
                <Link href="/contact">{t("nav_quote")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
