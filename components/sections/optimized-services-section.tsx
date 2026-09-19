"use client"

import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"
import { LazyLottie } from "@/components/lazy-lottie"
import { serviceAnimations } from "@/lib/lottie-animations"
import { CardGlow } from "@/components/effects/card-glow"

const services = [
  {
    title: "Video Production",
    description: "Cinematic storytelling through premium video content that captivates and converts.",
    animationData: serviceAnimations["Video Production"],
  },
  {
    title: "Photography",
    description: "Professional photography that captures the essence of your brand with artistic precision.",
    animationData: serviceAnimations["Photography"],
  },
  {
    title: "Brand Identity",
    description: "Complete brand identity design that reflects your values and resonates with your audience.",
    animationData: serviceAnimations["Brand Identity"],
  },
  {
    title: "Digital Marketing",
    description: "Strategic digital campaigns that amplify your message across all platforms.",
    animationData: serviceAnimations["Digital Marketing"],
  },
  {
    title: "Web Design",
    description: "Stunning websites that combine beautiful design with seamless user experience.",
    animationData: serviceAnimations["Web Design"],
  },
  {
    title: "Creative Direction",
    description: "End-to-end creative direction that ensures consistency across all touchpoints.",
    animationData: serviceAnimations["Creative Direction"],
  },
]

export function OptimizedServicesSection() {
  return (
    <OptimizedGSAPSection
      className="py-32 bg-muted noise-overlay"
      animationType="stagger"
      threshold={0.2}
      rootMargin="50px"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 data-animate className="text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p data-animate className="text-xl text-foreground/80 max-w-3xl mx-auto">
            We offer a comprehensive suite of creative services designed to elevate your brand and connect with your
            audience on a deeper level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <CardGlow
              key={service.title}
              className="group service-card p-8 bg-background/50 backdrop-blur-sm rounded-3xl md:rounded-[28px] lg:rounded-[32px] overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
              data-animate
            >
              <div className="mb-6 flex justify-center">
                <LazyLottie
                  animationData={service.animationData}
                  size={64}
                  hover={true}
                  priority={index < 3} // Prioritize first 3 services
                  className="text-primary transition-colors duration-300"
                />
              </div>
              <h3 className="text-2xl font-sora font-bold mb-4 text-center transition-colors duration-300 group-hover:text-primary">
                {service.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed text-center">{service.description}</p>
            </CardGlow>
          ))}
        </div>
      </div>
    </OptimizedGSAPSection>
  )
}
