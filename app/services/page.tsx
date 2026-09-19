import { ServicesPageContent } from "@/features/services/components/services-page-content"
import { CTASection } from "@/components/sections/cta-section"
import dynamic from "next/dynamic"

const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function ServicesPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientLight />
      
      {/* Page Sections */}
      <ServicesPageContent />
      <CTASection />
    </div>
  )
}
