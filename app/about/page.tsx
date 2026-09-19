import { AboutHero } from "@/features/about/components/about-hero"
import { AboutMission } from "@/features/about/components/about-mission"
import { AboutValues } from "@/features/about/components/about-values"
import { AboutTeam } from "@/features/about/components/about-team"
import { CTASection } from "@/components/sections/cta-section"
import dynamic from "next/dynamic"

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
