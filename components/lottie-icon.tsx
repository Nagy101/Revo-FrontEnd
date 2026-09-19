"use client"

import { useEffect, useRef, useState } from 'react'
import { Lottie } from 'lottie-react'

interface LottieIconProps {
  animationData: any
  size?: number
  className?: string
  autoplay?: boolean
  loop?: boolean
  hover?: boolean
  onClick?: () => void
}

export function LottieIcon({ 
  animationData, 
  size = 48, 
  className = '', 
  autoplay = false,
  loop = true,
  hover = true,
  onClick 
}: LottieIconProps) {
  const lottieRef = useRef<any>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (lottieRef.current) {
      if (autoplay) {
        lottieRef.current.play()
      } else {
        lottieRef.current.stop()
      }
    }
  }, [autoplay])

  useEffect(() => {
    if (lottieRef.current && hover) {
      if (isHovered) {
        lottieRef.current.play()
      } else {
        lottieRef.current.stop()
      }
    }
  }, [isHovered, hover])

  const handleMouseEnter = () => {
    if (hover) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (hover) {
      setIsHovered(false)
    }
  }

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <Lottie
        lottieRef={lottieRef}
        src={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
