import { ClientsSection } from "@/features/clients/components/clients-section"
import dynamic from "next/dynamic"

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

export const metadata = {
  title: "Our Clients | REVO",
  description: "We partner with visionary brands to create exceptional digital experiences that drive growth and innovation.",
}

export default function ClientsPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <AmbientLight />
      
      <div className="pt-16">
        <ClientsSection />
      </div>

      <CTASection />
    </div>
  )
}
