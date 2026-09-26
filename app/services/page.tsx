import { ServicesPageContent } from "@/features/services/components/services-page-content"
import dynamic from "next/dynamic"

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
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
