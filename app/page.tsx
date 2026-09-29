// ===================================
// HOME PAGE COMPONENT
// Main landing page with all sections
// Features: Hero, About, Services, Showreel, Clients, Testimonials, CTA
// ===================================

import dynamic from "next/dynamic"
import { OptimizedHeroSection } from "@/components/sections/optimized-hero-section"

// Below-the-fold sections: lazy-loaded so initial compile only handles the hero
const PortfolioSection = dynamic(() => import("@/features/portfolio/components/portfolio-section").then(m => m.PortfolioSection), { ssr: true })
const AboutSection = dynamic(() => import("@/components/sections/about-section").then(m => m.AboutSection), { ssr: true })
const ServicesSection = dynamic(() => import("@/features/services/components/services-section").then(m => m.ServicesSection), { ssr: true })
const ClientsSection = dynamic(() => import("@/features/clients/components/clients-section").then(m => m.ClientsSection), { ssr: true })
const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

// ===================================
// HOME PAGE COMPONENT
// Main landing page layout
// ===================================

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Background Effects */}
      <AmbientLight />

      {/* Page Sections */}
      <OptimizedHeroSection />
      <ClientsSection />
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
      <CTASection />
    </div>
  )
}
