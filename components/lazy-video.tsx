"use client"

import { useState, useRef, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Play, Pause } from 'lucide-react'

interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onLoad?: () => void
}

export function LazyVideo({
  src,
  poster,
  className = '',
  autoplay = false,
  muted = true,
  loop = false,
  controls = false,
  onLoad,
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '50px',
    triggerOnce: true,
  })

  const shouldLoad = hasIntersected

  useEffect(() => {
    if (shouldLoad && videoRef.current && !isLoaded) {
      videoRef.current.load()
    }
  }, [shouldLoad, isLoaded])

  const handleLoadedData = () => {
    setIsLoaded(true)
    onLoad?.()
    
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, which is expected in many browsers
      })
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleError = () => {
    setHasError(true)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  return (
    <div 
      // @ts-expect-error - HTMLDivElement vs HTMLElement ref mismatch
      ref={elementRef} 
      className={`relative overflow-hidden ${className}`}
    >
      {/* Loading state */}
      {!isLoaded && !hasError && shouldLoad && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-foreground/40 text-sm">Failed to load video</div>
        </div>
      )}

      {/* Video element */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster={poster}
          muted={muted}
          loop={loop}
          controls={controls}
          onLoadedData={handleLoadedData}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
          preload="none"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Custom play button */}
      {!controls && isLoaded && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="text-white" size={24} />
            ) : (
              <Play className="text-white ml-1" size={24} />
            )}
          </div>
        </button>
      )}
    </div>
  )
}
