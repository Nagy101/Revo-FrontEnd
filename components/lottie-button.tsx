"use client"

import { useRef } from 'react'
import { LottieIcon } from '@/components/lottie-icon'
import { useMagneticEffect } from '@/hooks/use-gsap'

interface LottieButtonProps {
  children: React.ReactNode
  animationData?: any
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function LottieButton({ 
  children, 
  animationData,
  className = '', 
  onClick,
  variant = 'primary',
  size = 'md'
}: LottieButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  useMagneticEffect(buttonRef)

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline'
  }

  return (
    <button
      ref={buttonRef}
      className={`${variantClasses[variant]} ${sizeClasses[size]} flex items-center gap-3 magnetic-btn ${className}`}
      onClick={onClick}
    >
      {animationData && (
        <LottieIcon
          animationData={animationData}
          size={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
          hover={true}
          autoplay={false}
        />
      )}
      {children}
    </button>
  )
}
