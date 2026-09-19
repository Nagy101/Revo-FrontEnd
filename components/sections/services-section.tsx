"use client"

import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'
import { LottieIcon } from '@/components/lottie-icon'
import { serviceAnimations } from '@/lib/lottie-animations'

const services = [
  {
    title: 'Photography',
    description: 'Corporate, product, fashion, events, and lifestyle photography with artistic precision and professional excellence.',
    animationData: serviceAnimations['Photography'],
  },
  {
    title: 'Videography & Cinematic Production',
    description: 'Commercial ads, brand videos, social media reels, and event coverage that tells your story with cinematic impact.',
    animationData: serviceAnimations['Video Production'],
  },
  {
    title: 'Social Media Content Creation',
    description: 'Tailored visuals for Instagram, Facebook, and TikTok designed to maximize engagement and reach.',
    animationData: serviceAnimations['Digital Marketing'],
  },
  {
    title: 'Creative Campaigns & Brand Shoots',
    description: 'Full-service media strategies for brands with comprehensive creative direction and campaign development.',
    animationData: serviceAnimations['Creative Direction'],
  },
]

export function ServicesSection() {
  const containerRef = useGSAP(() => {
    // Title animation
    gsap.fromTo('.services-title', 
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.services-title',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Subtitle animation
    gsap.fromTo('.services-subtitle', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.services-subtitle',
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Service cards stagger animation
    gsap.fromTo('.service-card', 
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.services-grid',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Enhanced hover animations for service cards
    const serviceCards = document.querySelectorAll('.service-card')
    serviceCards.forEach((card) => {
      const title = card.querySelector('.service-title')
      
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to(title, {
          color: '#FF5C00',
          duration: 0.3,
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to(title, {
          color: '',
          duration: 0.3,
        })
      })
    })
  })

  return (
    <section ref={containerRef} className="py-32 bg-muted noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="services-title text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="services-subtitle text-xl text-foreground/80 max-w-3xl mx-auto">
            We offer a comprehensive suite of creative services designed to elevate your brand 
            and connect with your audience on a deeper level.
          </p>
        </div>
        
        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="service-card group p-8 bg-background/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
            >
              <div className="mb-6 flex justify-center">
                <LottieIcon
                  animationData={service.animationData}
                  size={64}
                  hover={true}
                  className="text-primary transition-colors duration-300"
                />
              </div>
              <h3 className="service-title text-2xl font-sora font-bold mb-4 text-center transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
