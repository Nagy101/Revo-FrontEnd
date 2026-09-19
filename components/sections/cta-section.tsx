"use client"

import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'

export function CTASection() {
  const containerRef = useGSAP(() => {
    // Title animations
    gsap.fromTo('.cta-title-1', 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.cta-title-1',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    gsap.fromTo('.cta-title-2', 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.cta-title-2',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Description animation
    gsap.fromTo('.cta-description', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.cta-description',
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Buttons animation
    gsap.fromTo('.cta-buttons', 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.cta-buttons',
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Features animation
    gsap.fromTo('.cta-feature', 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.cta-features',
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Magnetic effect for buttons
    const buttons = document.querySelectorAll('.magnetic-btn')
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })
      })
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  })

  return (
    <section ref={containerRef} className="py-32 bg-gradient-to-br from-primary/10 to-secondary/10 noise-overlay">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="cta-title-1 text-5xl md:text-7xl font-sora font-bold uppercase mb-8">
          Ready to Create
        </h2>
        <h3 className="cta-title-2 text-4xl md:text-6xl font-sora font-bold uppercase mb-12 gradient-text">
          Something Amazing?
        </h3>
        
        <p className="cta-description text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto mb-16 leading-relaxed">
          Let's collaborate to bring your vision to life. Whether you need a complete brand overhaul 
          or a single campaign, we're here to make it extraordinary.
        </p>
        
        <div className="cta-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="btn-primary text-xl px-16 py-5 flex items-center gap-3 magnetic-btn">
            Start Your Project
            <ArrowRight size={20} />
          </button>
          <button className="btn-outline text-xl px-16 py-5 magnetic-btn">
            Schedule a Call
          </button>
        </div>
        
        <div className="cta-features grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="cta-feature text-center">
            <div className="text-2xl font-bold text-primary mb-2">Free Consultation</div>
            <div className="text-foreground/70">30-minute strategy session</div>
          </div>
          <div className="cta-feature text-center">
            <div className="text-2xl font-bold text-secondary mb-2">Quick Turnaround</div>
            <div className="text-foreground/70">Projects delivered on time</div>
          </div>
          <div className="cta-feature text-center">
            <div className="text-2xl font-bold text-primary mb-2">Full Support</div>
            <div className="text-foreground/70">End-to-end project management</div>
          </div>
        </div>
      </div>
    </section>
  )
}
