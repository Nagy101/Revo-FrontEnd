"use client"

import { useState } from 'react'
import { LottieIcon } from '@/components/lottie-icon'
import { serviceAnimations } from '@/lib/lottie-animations'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@/hooks/use-gsap'

const services = [
  {
    title: 'Video Production',
    description: 'Cinematic storytelling through premium video content that captivates and converts.',
    features: ['Commercial Videos', 'Documentaries', 'Corporate Films', 'Social Media Content'],
    animationData: serviceAnimations['Video Production'],
  },
  {
    title: 'Photography',
    description: 'Professional photography that captures the essence of your brand with artistic precision.',
    features: ['Product Photography', 'Portrait Sessions', 'Event Coverage', 'Commercial Shoots'],
    animationData: serviceAnimations['Photography'],
  },
  {
    title: 'Brand Identity',
    description: 'Complete brand identity design that reflects your values and resonates with your audience.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
    animationData: serviceAnimations['Brand Identity'],
  },
  {
    title: 'Digital Marketing',
    description: 'Strategic digital campaigns that amplify your message across all platforms.',
    features: ['Social Media Strategy', 'Content Creation', 'Ad Campaigns', 'Analytics & Reporting'],
    animationData: serviceAnimations['Digital Marketing'],
  },
  {
    title: 'Web Design',
    description: 'Stunning websites that combine beautiful design with seamless user experience.',
    features: ['Custom Design', 'Responsive Development', 'E-commerce Solutions', 'CMS Integration'],
    animationData: serviceAnimations['Web Design'],
  },
  {
    title: 'Creative Direction',
    description: 'End-to-end creative direction that ensures consistency across all touchpoints.',
    features: ['Creative Strategy', 'Art Direction', 'Campaign Development', 'Brand Consulting'],
    animationData: serviceAnimations['Creative Direction'],
  },
]

export function InteractiveServiceShowcase() {
  const [activeService, setActiveService] = useState(0)

  const containerRef = useGSAP(() => {
    // Initial animation
    gsap.fromTo('.showcase-container', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.showcase-container',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Service tabs animation
    gsap.fromTo('.service-tab', 
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.service-tabs',
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Content area animation
    gsap.fromTo('.service-content', 
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.service-content',
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )
  })

  const handleServiceChange = (index: number) => {
    if (index === activeService) return

    // Animate out current content
    gsap.to('.content-details', {
      opacity: 0,
      x: 20,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setActiveService(index)
        // Animate in new content
        gsap.fromTo('.content-details', 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
        )
      }
    })
  }

  return (
    <section ref={containerRef} className="py-32 bg-muted noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <div className="showcase-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold uppercase mb-6">
              Interactive <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Explore our services with interactive animations and detailed breakdowns.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Service Tabs */}
            <div className="service-tabs space-y-4">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`service-tab p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeService === index
                      ? 'bg-primary/10 border-primary shadow-lg'
                      : 'bg-background/50 border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleServiceChange(index)}
                >
                  <div className="flex items-center gap-4">
                    <LottieIcon
                      animationData={service.animationData}
                      size={48}
                      autoplay={activeService === index}
                      hover={false}
                    />
                    <div>
                      <h3 className={`text-xl font-sora font-bold transition-colors duration-300 ${
                        activeService === index ? 'text-primary' : 'text-foreground'
                      }`}>
                        {service.title}
                      </h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Click to explore details
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Content */}
            <div className="service-content">
              <div className="content-details bg-background/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
                <div className="flex items-center gap-6 mb-6">
                  <LottieIcon
                    animationData={services[activeService].animationData}
                    size={80}
                    autoplay={true}
                    loop={true}
                    hover={false}
                  />
                  <div>
                    <h3 className="text-3xl font-sora font-bold gradient-text mb-2">
                      {services[activeService].title}
                    </h3>
                    <p className="text-foreground/80">
                      {services[activeService].description}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">What's Included:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {services[activeService].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm text-foreground/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <button className="btn-primary w-full">
                    Get Started with {services[activeService].title}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
