"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from '@/lib/gsap'
import { LottieTestimonialStars } from '@/components/lottie-testimonial-stars'

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'Luxury Brands Inc.',
    role: 'Creative Director',
    content: 'REVO transformed our brand vision into a cinematic masterpiece. Their attention to detail and creative excellence exceeded all expectations.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    company: 'Tech Innovations',
    role: 'CEO',
    content: 'Working with REVO was a game-changer for our startup. They captured our essence and translated it into powerful visual storytelling.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    company: 'Fashion Forward',
    role: 'Brand Manager',
    content: 'The team at REVO brought our fashion campaign to life with stunning visuals and compelling narratives that resonated with our audience.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const containerRef = useGSAP(() => {
    // Title animation
    gsap.fromTo('.testimonials-title', 
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.testimonials-title',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Testimonial card animation
    gsap.fromTo('.testimonial-card', 
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.testimonial-card',
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Animate testimonial change
  useEffect(() => {
    gsap.fromTo('.testimonial-content', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
  }, [currentIndex])

  return (
    <section ref={containerRef} className="py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="testimonials-title text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients say about working with REVO.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="testimonial-card bg-background/50 backdrop-blur-sm rounded-3xl p-12 border border-border">
            <div className="stars-container flex justify-center mb-6">
              <LottieTestimonialStars 
                rating={testimonials[currentIndex].rating}
                size={24}
                animated={true}
              />
            </div>
            
            <div className="testimonial-content">
              <blockquote className="text-2xl md:text-3xl font-light text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div className="text-center">
                <div className="font-sora font-bold text-xl mb-1">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-primary font-medium">
                  {testimonials[currentIndex].role}
                </div>
                <div className="text-foreground/60">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:border-primary flex items-center justify-center transition-colors duration-300 magnetic-btn"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:border-primary flex items-center justify-center transition-colors duration-300 magnetic-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
