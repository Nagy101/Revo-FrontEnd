"use client"

import { useRef, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { gsap } from '@/lib/gsap'

interface OptimizedGSAPSectionProps {
  children: React.ReactNode
  className?: string
  animationType?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger'
  delay?: number
  duration?: number
  staggerDelay?: number
  threshold?: number
  rootMargin?: string
}

export function OptimizedGSAPSection({
  children,
  className = '',
  animationType = 'fadeUp',
  delay = 0,
  duration = 1,
  staggerDelay = 0.1,
  threshold = 0.2,
  rootMargin = '0px',
}: OptimizedGSAPSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  useEffect(() => {
    if (hasIntersected && !hasAnimated.current && sectionRef.current) {
      hasAnimated.current = true

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const elements = sectionRef.current.querySelectorAll('[data-animate]')
      
      if (reduceMotion) {
        if (elements.length > 0) {
          gsap.set(elements, { opacity: 1, x: 0, y: 0, scale: 1 })
        } else {
          gsap.set(sectionRef.current, { opacity: 1, x: 0, y: 0, scale: 1 })
        }
        return
      }

      if (elements.length === 0) {
        // Animate the entire section if no specific elements are marked
        animateElement(sectionRef.current, animationType, delay, duration)
      } else {
        // Animate marked elements with stagger
        elements.forEach((element, index) => {
          const elementDelay = delay + (index * staggerDelay)
          animateElement(element as HTMLElement, animationType, elementDelay, duration)
        })
      }
    }
  }, [hasIntersected, animationType, delay, duration, staggerDelay])

  const animateElement = (element: HTMLElement, type: string, elementDelay: number, elementDuration: number) => {
    switch (type) {
      case 'fadeUp':
        gsap.fromTo(element,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: elementDuration, delay: elementDelay, ease: "power2.out" }
        )
        break
      case 'fadeIn':
        gsap.fromTo(element,
          { opacity: 0 },
          { opacity: 1, duration: elementDuration, delay: elementDelay, ease: "power2.out" }
        )
        break
      case 'slideLeft':
        gsap.fromTo(element,
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: elementDuration, delay: elementDelay, ease: "power2.out" }
        )
        break
      case 'slideRight':
        gsap.fromTo(element,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: elementDuration, delay: elementDelay, ease: "power2.out" }
        )
        break
      case 'scale':
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: elementDuration, delay: elementDelay, ease: "back.out(1.7)" }
        )
        break
      case 'stagger':
        const childElements = element.children
        gsap.fromTo(childElements,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: elementDuration, 
            delay: elementDelay,
            stagger: staggerDelay,
            ease: "power2.out" 
          }
        )
        break
    }
  }

  return (
    <section
      ref={(el) => {
        elementRef.current = el
        sectionRef.current = el
      }}
      className={className}
    >
      {children}
    </section>
  )
}
