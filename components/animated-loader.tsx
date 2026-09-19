"use client"

import { useEffect, useState } from 'react'
// @ts-ignore - lottie-react types are sometimes weird with default exports
import Lottie from "lottie-react"
import { loadingAnimation } from '@/lib/lottie-animations'
import { gsap } from '@/lib/gsap'

export function AnimatedLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          // Animate loader out
          gsap.to('.loader-container', {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => setIsLoading(false)
          })
          return 100
        }
        return prev + 1.5
      })
    }, 40)

    // Animate loader in
    gsap.fromTo('.loader-container', 
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    )

    // Animate REVO text
    gsap.fromTo('.loader-title', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    )

    // Animate progress bar container
    gsap.fromTo('.progress-container', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
    )

    return () => clearInterval(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="loader-container fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Lottie Animation */}
        <div className="mb-8 flex justify-center">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 120, height: 120 }}
          />
        </div>

        {/* REVO Title */}
        <div className="loader-title text-6xl font-sora font-bold gradient-text mb-8">
          REVO
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="w-64 h-1 bg-border rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-foreground/60">
            Loading... {Math.round(progress)}%
          </div>
        </div>

        {/* Loading Text Animation */}
        <div className="mt-6 text-foreground/40 text-sm">
          <span className="inline-block animate-pulse">Preparing your experience</span>
        </div>
      </div>
    </div>
  )
}
