import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, MorphSVGPlugin)
}

// GSAP configuration
gsap.config({
  force3D: true,
  nullTargetWarn: false,
})

// Custom easing functions
export const customEase = {
  power: "power2.inOut",
  back: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  bounce: "bounce.out",
  expo: "expo.out",
}

// Animation presets
export const animations = {
  fadeInUp: {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: customEase.power,
  },
  fadeInDown: {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: customEase.power,
  },
  fadeInLeft: {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: customEase.power,
  },
  fadeInRight: {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: customEase.power,
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: customEase.back,
  },
  slideInUp: {
    y: "100%",
    duration: 1.2,
    ease: customEase.expo,
  },
  staggerFadeIn: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: customEase.power,
    stagger: 0.1,
  },
}

// Reduced motion check
export const isReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Utility functions
export const createScrollTrigger = (element: string | Element, animation: any, options?: any) => {
  if (isReducedMotion()) {
    gsap.set(element, { clearProps: "all" })
    return null
  }

  // Determine standard toVars based on standard fade/slide patterns, to fix the bug where fromVars was passed as toVars.
  const toVars: any = {
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      ...options,
    },
  }

  if ('opacity' in animation) toVars.opacity = 1
  if ('y' in animation) toVars.y = 0
  if ('x' in animation) toVars.x = 0
  if ('scale' in animation) toVars.scale = 1
  if ('duration' in animation) toVars.duration = animation.duration
  if ('ease' in animation) toVars.ease = animation.ease
  if ('stagger' in animation) toVars.stagger = animation.stagger

  return gsap.fromTo(element, animation, toVars)
}

export const createParallax = (element: string | Element, speed: number = 0.5) => {
  if (isReducedMotion()) return null

  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  })
}

export const createMagneticEffect = (element: Element) => {
  if (isReducedMotion()) return () => {}

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(element, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: customEase.power,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: customEase.elastic,
    })
  }

  element.addEventListener('mousemove', handleMouseMove as EventListener)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove as EventListener)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

export { gsap, ScrollTrigger }
