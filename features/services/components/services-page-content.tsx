"use client"

import { usePublicServices } from "../hooks/useServices"
import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"
import { CardGlow } from "@/components/effects/card-glow"
import { ArrowRight, Camera, Video, Megaphone, Zap, Monitor, Code, PenTool, LayoutTemplate } from "lucide-react"

// Icon mapping helper
const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    camera: Camera,
    video: Video,
    megaphone: Megaphone,
    zap: Zap,
    monitor: Monitor,
    code: Code,
    pen: PenTool,
    layout: LayoutTemplate,
  }
  const Icon = icons[iconName.toLowerCase()] || Zap
  return <Icon size={32} className="text-white" />
}

export function ServicesPageContent() {
  const { data: services = [], isLoading } = usePublicServices()

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 relative z-10 noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            We offer a comprehensive suite of creative services designed to elevate your brand and connect with your
            audience on a deeper level.
          </p>
        </div>

        {/* Services Grid */}
        <OptimizedGSAPSection
          className="grid lg:grid-cols-2 gap-8 mb-20"
          animationType="stagger"
          threshold={0.1}
        >
          {services.map((service) => (
            <CardGlow
              key={service.id}
              data-animate
              className="group p-8 bg-background/50 backdrop-blur-sm rounded-3xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Service Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {getIcon(service.icon)}
                  </div>
                </div>

                {/* Service Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-sora font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.titleEn}
                  </h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed text-lg">
                    {service.descriptionEn}
                  </p>

                  <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors mt-auto pt-4">
                    Learn More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </CardGlow>
          ))}
        </OptimizedGSAPSection>
      </div>
    </div>
  )
}
