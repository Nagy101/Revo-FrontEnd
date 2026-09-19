"use client"

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'

const projects = [
  {
    title: 'Luxury Fashion Campaign',
    category: 'Fashion',
    image: '/placeholder.svg?height=400&width=600',
    description: 'A cinematic fashion campaign that redefined elegance and sophistication.',
  },
  {
    title: 'Tech Startup Branding',
    category: 'Branding',
    image: '/placeholder.svg?height=400&width=600',
    description: 'Complete brand identity for a revolutionary fintech startup.',
  },
  {
    title: 'Sports Documentary',
    category: 'Video',
    image: '/placeholder.svg?height=400&width=600',
    description: 'An inspiring documentary following athletes on their journey to greatness.',
  },
]

export function FeaturedProjectsSection() {
  const containerRef = useGSAP(() => {
    // Title animation
    gsap.fromTo('.projects-title', 
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.projects-title',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Project cards animation
    gsap.fromTo('.project-card', 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.projects-grid',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // CTA button animation
    gsap.fromTo('.projects-cta', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.projects-cta',
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card')
    projectCards.forEach((card) => {
      const image = card.querySelector('.project-image')
      const overlay = card.querySelector('.project-overlay')
      const icon = card.querySelector('.project-icon')
      const category = card.querySelector('.project-category')
      const title = card.querySelector('.project-title')
      
      card.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out",
        })
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
        })
        gsap.to(icon, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        gsap.to(category, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
        })
        gsap.to(title, {
          color: '#FF5C00',
          duration: 0.3,
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        })
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        })
        gsap.to(icon, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        })
        gsap.to(category, {
          y: 16,
          opacity: 0,
          duration: 0.3,
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
          <h2 className="projects-title text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Discover some of our most impactful work that has helped brands 
            tell their stories and achieve their goals.
          </p>
        </div>
        
        <div className="projects-grid grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="project-card group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="project-image w-full h-80 object-cover transition-transform duration-500"
                />
                <div className="project-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300" />
                <div className="project-icon absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 scale-80 transition-all duration-300">
                  <ExternalLink className="text-white" size={16} />
                </div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 transition-all duration-300">
                  <span className="project-category inline-block px-3 py-1 bg-primary text-white text-sm rounded-full mb-2">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <h3 className="project-title text-2xl font-sora font-bold mb-3 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="projects-cta text-center mt-16">
          <button className="btn-outline text-lg px-12 py-4">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}
