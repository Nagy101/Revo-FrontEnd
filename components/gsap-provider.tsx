"use client"

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
    
    // Refresh ScrollTrigger on route changes
    ScrollTrigger.refresh()

    // Global smooth scrolling
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0,
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
