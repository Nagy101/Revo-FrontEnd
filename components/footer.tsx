"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Clients", href: "/clients" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
}

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/revoagency", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/revoagency", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/revoagency", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/company/revoagency", icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-sora font-bold gradient-text">REVO</span>
            </Link>
            <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
              Creative digital agency transforming brands with cutting-edge solutions.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground/60 text-sm">
                <Mail size={14} className="text-primary" />
                <a href="mailto:hello@revoagency.com" className="hover:text-primary transition-colors">
                  hello@revoagency.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-foreground/60 text-sm">
                <Phone size={14} className="text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center gap-2 text-foreground/60 text-sm">
                <MapPin size={14} className="text-primary" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-foreground font-medium mb-4 text-sm">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-foreground/60 hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-foreground font-medium mb-4 text-sm">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-foreground/60 hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-foreground font-medium mb-4 text-sm">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-muted hover:bg-primary/10 rounded-lg transition-all duration-200 hover:scale-105 group"
                    aria-label={social.name}
                  >
                    <Icon size={16} className="text-foreground/60 group-hover:text-primary transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-foreground/50 text-sm">© 2024 REVO Agency. All rights reserved.</p>
            <p className="text-foreground/50 text-sm">Made with ❤️ by REVO Team</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
