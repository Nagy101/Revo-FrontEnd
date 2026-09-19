"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { gsap } from '@/lib/gsap'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: string
  onLoad?: () => void
  animationType?: 'fade' | 'scale' | 'blur' | 'slide'
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = '/placeholder.svg?height=400&width=600',
  onLoad,
  animationType = 'fade',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
    skip: priority,
  })

  const shouldLoad = priority || hasIntersected

  useEffect(() => {
    if (isLoaded && imageRef.current) {
      // Animate image in based on animation type
      switch (animationType) {
        case 'fade':
          gsap.fromTo(imageRef.current, 
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
          )
          break
        case 'scale':
          gsap.fromTo(imageRef.current, 
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
          )
          break
        case 'blur':
          gsap.fromTo(imageRef.current, 
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1, ease: "power2.out" }
          )
          break
        case 'slide':
          gsap.fromTo(imageRef.current, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          )
          break
      }
    }
  }, [isLoaded, animationType])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div
      ref={(el) => {
        elementRef.current = el
        imageRef.current = el
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-foreground/40 text-sm">Failed to load image</div>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && (
        <Image
          src={hasError ? placeholder : src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}
