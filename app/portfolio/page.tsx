import dynamic from "next/dynamic"

const PortfolioListingPage = dynamic(() => import("@/features/portfolio/components/portfolio-listing-page").then(m => m.PortfolioListingPage), { ssr: true })
const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function PortfolioPage() {
  return (
    <div className="relative w-full -mt-20">
      <AmbientLight />
      
      {/* Portfolio Listing */}
      <PortfolioListingPage />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
