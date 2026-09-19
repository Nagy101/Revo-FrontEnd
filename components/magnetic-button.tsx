"use client"

import { useRef } from 'react'
import { useMagneticEffect } from '@/hooks/use-gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  useMagneticEffect(buttonRef)

  return (
    <button
      ref={buttonRef}
      className={`magnetic-btn ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
