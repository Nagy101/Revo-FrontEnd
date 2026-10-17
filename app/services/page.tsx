import type { Metadata } from "next"
import { ServicesPageContent } from "@/features/services/components/services-page-content"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  title: "Services",
  description: "From live concert coverage to cinematic commercial films, discover REVO's full-spectrum media production capabilities.",
  openGraph: {
    title: "Services | REVO Media Production",
    description: "From live concert coverage to cinematic commercial films, discover REVO's full-spectrum media production capabilities.",
  },
}

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export default function ServicesPage() {
  return (
    <div className="relative w-full">
      <AmbientLight />
      
      {/* Page Sections */}
      <ServicesPageContent />
      <CTASection />
    </div>
  )
}
