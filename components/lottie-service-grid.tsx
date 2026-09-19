"use client"

import { LottieIcon } from '@/components/lottie-icon'
import { serviceAnimations } from '@/lib/lottie-animations'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'

const services = [
  {
    title: 'Photography',
    description: 'Corporate, product, fashion, events, and lifestyle photography.',
    animationData: serviceAnimations['Photography'],
    color: 'from-primary to-primary/70',
  },
  {
    title: 'Videography & Cinematic Production',
    description: 'Commercial ads, brand videos, social media reels, and event coverage.',
    animationData: serviceAnimations['Video Production'],
    color: 'from-secondary to-secondary/70',
  },
  {
    title: 'Social Media Content Creation',
    description: 'Tailored visuals for Instagram, Facebook, and TikTok.',
    animationData: serviceAnimations['Digital Marketing'],
    color: 'from-primary to-secondary',
  },
  {
    title: 'Creative Campaigns & Brand Shoots',
    description: 'Full-service media strategies for brands.',
    animationData: serviceAnimations['Creative Direction'],
    color: 'from-secondary to-primary',
  },
]

export function LottieServiceGrid() {
  const containerRef = useGSAP(() => {
    // Grid animation
    gsap.fromTo('.lottie-service-card', 
      { y: 100, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.lottie-service-grid',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Hover animations
    const cards = document.querySelectorAll('.lottie-service-card')
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  })

  return (
    <section ref={containerRef} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="lottie-service-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="lottie-service-card group relative p-8 bg-background/50 backdrop-blur-sm rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <LottieIcon
                    animationData={service.animationData}
                    size={80}
                    hover={true}
                    autoplay={false}
                  />
                </div>
                
                <h3 className="text-xl font-sora font-bold text-center mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-foreground/70 text-center text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
