import { OptimizedGSAPSection } from "@/components/optimized-gsap-section"

export function AboutMission() {
  return (
    <OptimizedGSAPSection
      className="py-20 bg-muted/50 backdrop-blur-sm noise-overlay relative z-10 border-y border-border/50"
      animationType="fadeUp"
      threshold={0.3}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 data-animate className="text-4xl md:text-5xl font-sora font-bold uppercase mb-12">
          Our <span className="gradient-text">Mission</span>
        </h2>
        <p data-animate className="text-2xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
          "To revolutionize how brands tell their stories through cinematic creativity, innovative design, and
          strategic thinking that drives meaningful connections."
        </p>
      </div>
    </OptimizedGSAPSection>
  )
}
