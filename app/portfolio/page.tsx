import { PortfolioListingPage } from "@/features/portfolio/components/portfolio-listing-page"
import { CTASection } from "@/components/sections/cta-section"
import dynamic from "next/dynamic"

const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function PortfolioPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientLight />
      
      {/* Portfolio Listing */}
      <PortfolioListingPage />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
