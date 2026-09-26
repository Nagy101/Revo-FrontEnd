import { AboutHero } from "@/features/about/components/about-hero"
import dynamic from "next/dynamic"

const AboutMission = dynamic(() => import("@/features/about/components/about-mission").then(m => m.AboutMission), { ssr: true })
const AboutValues = dynamic(() => import("@/features/about/components/about-values").then(m => m.AboutValues), { ssr: true })
const AboutTeam = dynamic(() => import("@/features/about/components/about-team").then(m => m.AboutTeam), { ssr: true })
const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <AmbientLight />

      {/* Page Sections */}
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <CTASection />
    </div>
  )
}
