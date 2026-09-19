"use client"

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { gsap } from '@/lib/gsap'

// Dynamically import Lottie to reduce initial bundle size
const Lottie = dynamic(() => import('lottie-react').then((module) => module.Lottie), {
  loading: () => (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
})

interface LazyLottieProps {
  animationData: any
  size?: number
  className?: string
  autoplay?: boolean
  loop?: boolean
  hover?: boolean
  onClick?: () => void
  priority?: boolean
  animateIn?: boolean
}

export function LazyLottie({
  animationData,
  size = 48,
  className = '',
  autoplay = false,
  loop = true,
  hover = true,
  onClick,
  priority = false,
  animateIn = true,
}: LazyLottieProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const lottieRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
    skip: priority,
  })

  const shouldLoad = priority || hasIntersected

  useEffect(() => {
    if (isLoaded && animateIn && containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )
    }
  }, [isLoaded, animateIn])

  useEffect(() => {
    if (lottieRef.current && shouldLoad) {
      if (autoplay) {
        lottieRef.current.play()
      } else {
        lottieRef.current.stop()
      }
    }
  }, [autoplay, shouldLoad])

  useEffect(() => {
    if (lottieRef.current && hover && shouldLoad) {
      if (isHovered) {
        lottieRef.current.play()
      } else {
        lottieRef.current.stop()
      }
    }
  }, [isHovered, hover, shouldLoad])

  const handleMouseEnter = () => {
    if (hover && shouldLoad) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (hover && shouldLoad) {
      setIsHovered(false)
    }
  }

  useEffect(() => {
    if (shouldLoad) {
      setIsLoaded(true)
    }
  }, [shouldLoad])

  return (
    <div
      ref={(el) => {
        elementRef.current = el
        containerRef.current = el
      }}
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {shouldLoad ? (
        <Lottie
          lottieRef={lottieRef}
          src={animationData}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div className="w-full h-full bg-muted/20 rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-primary/30 rounded-full" />
        </div>
      )}
    </div>
  )
}
