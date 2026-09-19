// ===================================
// HOME PAGE COMPONENT
// Main landing page with all sections
// Features: Hero, About, Services, Showreel, Clients, Testimonials, CTA
// ===================================

import { OptimizedHeroSection } from "@/components/sections/optimized-hero-section"
import { PortfolioSection } from "@/features/portfolio/components/portfolio-section"
import { AboutSection } from "@/components/sections/about-section"
import { ServicesSection } from "@/features/services/components/services-section"
import { ClientsSection } from "@/features/clients/components/clients-section"
import { CTASection } from "@/components/sections/cta-section"
import dynamic from "next/dynamic"

const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

// ===================================
// HOME PAGE COMPONENT
// Main landing page layout
// ===================================

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <AmbientLight />

      {/* Page Sections */}
      <OptimizedHeroSection />
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
      <ClientsSection />
      <CTASection />
    </div>
  )
}
