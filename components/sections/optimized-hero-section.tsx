"use client"

import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { LazyLottie } from '@/components/lazy-lottie'

export function OptimizedHeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    import('@/lib/lottie-animations').then(m => setAnimationData(m.loadingAnimation))
  }, [])

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && !hasAnimated.current && containerRef.current) {
      hasAnimated.current = true

      // Hero text animation - delayed to wait for loader
      const tl = gsap.timeline({ delay: 3.5 })
      
      tl.fromTo('.hero-title-1', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.hero-title-2', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo('.hero-subtitle', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo('.hero-buttons', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo('.hero-arrow', 
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      )

      // Floating elements animation - only if user prefers motion
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to('.floating-1', {
          y: -20,
          duration: 3,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        })

        gsap.to('.floating-2', {
          y: -15,
          x: 10,
          duration: 4,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1,
        })

        gsap.to('.floating-3', {
          y: -25,
          x: -5,
          duration: 3.5,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2,
        })
      }

      // Parallax background - only on desktop and if user prefers motion
      if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to('.hero-bg', {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }
    }
  }, [hasIntersected])

  return (
    <section 
      ref={(el) => {
        elementRef.current = el
        containerRef.current = el
      }}
      className="relative min-h-screen flex items-center justify-center noise-overlay overflow-hidden"
    >
      {/* Parallax Background */}
      <div className="hero-bg absolute inset-0 bg-gradient-to-br from-background via-background to-muted scale-110" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Decorative Lottie Animation - Lazy loaded */}
        <div className="hero-lottie absolute -top-20 -right-20 opacity-20">
          {animationData ? (
            <LazyLottie
              animationData={animationData}
              size={200}
              autoplay={true}
              loop={true}
              hover={false}
              priority={false}
              animateIn={true}
            />
          ) : (
            <div style={{ width: 200, height: 200 }} />
          )}
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-sora font-bold uppercase leading-none mb-6">
          <span className="hero-title-1 block">Creative</span>
          <span className="hero-title-2 block gradient-text">Revolution</span>
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed">
          We craft cinematic stories that captivate, inspire, and drive results. 
          From concept to creation, we bring your vision to life.
        </p>
        
        <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="btn-primary text-lg px-12 py-4 magnetic-btn">
            View Our Work
          </button>
          <button className="btn-outline text-lg px-12 py-4 magnetic-btn">
            Start a Project
          </button>
        </div>
        
        <div className="hero-arrow">
          <ArrowDown className="mx-auto text-primary animate-bounce" size={32} />
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="floating-1 absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full" />
      <div className="floating-2 absolute top-1/3 right-20 w-3 h-3 bg-secondary rounded-full" />
      <div className="floating-3 absolute bottom-1/4 left-1/4 w-1 h-1 bg-primary rounded-full" />
    </section>
  )
}
