"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
  name: string
  href: string
  icon?: any
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Clients", href: "/clients" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false)

  // Auto-logout when accessing main navigation from admin
  useEffect(() => {
    const wasInAdmin = sessionStorage.getItem("was-in-admin")
    if (wasInAdmin) {
      localStorage.removeItem("admin-authenticated")
      sessionStorage.removeItem("was-in-admin")
      console.log("Auto-logout: Accessed main navigation from admin")
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-0" : "bg-transparent border-b border-transparent py-2"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl font-sora font-bold gradient-text">REVO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="w-px h-6 bg-border"></div>
            <Button asChild className="btn-primary">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button & CTA */}
          <div className="lg:hidden flex items-center space-x-4">
            <Button asChild size="sm" className="btn-primary">
              <Link href="/contact">Quote</Link>
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 text-foreground hover:text-primary transition-colors"
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
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 text-xl font-medium transition-colors duration-200 hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
