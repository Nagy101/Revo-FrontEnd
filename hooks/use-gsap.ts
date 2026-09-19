"use client"

import { useEffect, useRef, RefObject } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useGSAP(
  callback: (context: { selector: (selector: string) => Element[] }) => void,
  dependencies: any[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const context = gsap.context(() => {
      const selector = (sel: string) => 
        Array.from(containerRef.current?.querySelectorAll(sel) || [])
      
      callback({ selector })
    }, containerRef.current)

    return () => context.revert()
  }, dependencies)

  return containerRef
}

export function useScrollTrigger(
  element: RefObject<Element>,
  animation: gsap.TweenVars,
  options?: ScrollTrigger.Vars
) {
  useEffect(() => {
    if (!element.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...options,
      },
    })

    tl.fromTo(element.current, 
      { opacity: 0, y: 50, ...animation },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", ...animation }
    )

    return () => {
      tl.kill()
    }
  }, [element, animation, options])
}

export function useMagneticEffect(element: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!element.current) return

    const el = element.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [element])
}
