"use client"

import { Play } from 'lucide-react'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'

export function ShowreelSection() {
  const containerRef = useGSAP(() => {
    // Title animation
    gsap.fromTo('.showreel-title', 
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.showreel-title',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Video container animation
    gsap.fromTo('.video-container', 
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.video-container',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Play button pulse animation
    gsap.to('.play-button', {
      scale: 1.1,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    })

    // Video info slide up
    gsap.fromTo('.video-info', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.video-info',
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Parallax effect for video container
    gsap.to('.video-container', {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // Hover effect for video container
    const videoContainer = document.querySelector('.video-container')
    if (videoContainer) {
      videoContainer.addEventListener('mouseenter', () => {
        gsap.to('.play-button', {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        gsap.to('.video-overlay', {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          duration: 0.3,
        })
      })
      
      videoContainer.addEventListener('mouseleave', () => {
        gsap.to('.play-button', {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        })
        gsap.to('.video-overlay', {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          duration: 0.3,
        })
      })
    }
  })

  return (
    <section ref={containerRef} className="py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="showreel-title text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Our <span className="gradient-text">Showreel</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Experience the power of our creative vision through our latest showreel.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="video-container relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl overflow-hidden group cursor-pointer">
            <video
              className="w-full h-full object-cover"
              poster="/placeholder.svg?height=720&width=1280"
              muted
              loop
            >
              {/* Media source temporarily removed pending confirmed asset contract */}
            </video>
            
            <div className="video-overlay absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300">
              <div className="play-button w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300">
                <Play className="text-white ml-1" size={32} />
              </div>
            </div>
            
            <div className="video-info absolute bottom-8 left-8 right-8">
              <h3 className="text-3xl font-sora font-bold text-white mb-2">
                REVO Showreel 2024
              </h3>
              <p className="text-white/80">
                A collection of our finest work showcasing creativity in motion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
