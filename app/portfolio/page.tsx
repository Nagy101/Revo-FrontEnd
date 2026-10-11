import { PortfolioListingPage } from "@/features/portfolio/components/portfolio-listing-page"
import dynamic from "next/dynamic"

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function PortfolioPage() {
  return (
    <div className="relative w-full">
      <AmbientLight />
      
      {/* Portfolio Listing */}
      <PortfolioListingPage />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
