"use client"

import { useState } from 'react'
import { LottieIcon } from '@/components/lottie-icon'
import { loadingAnimation } from '@/lib/lottie-animations'

interface LottieLoadingProps {
  isLoading: boolean
  size?: number
  message?: string
}

export function LottieLoading({ isLoading, size = 60, message = "Loading..." }: LottieLoadingProps) {
  if (!isLoading) return null

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LottieIcon
        animationData={loadingAnimation}
        size={size}
        autoplay={true}
        loop={true}
        hover={false}
      />
      <p className="text-foreground/60 text-sm mt-4">{message}</p>
    </div>
  )
}

export function LottieButton({ 
  children, 
  onClick, 
  isLoading = false, 
  className = '',
  variant = 'primary' 
}: {
  children: React.ReactNode
  onClick?: () => void
  isLoading?: boolean
  className?: string
  variant?: 'primary' | 'outline'
}) {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-outline'
  
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClasses} ${className} flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <LottieIcon
          animationData={loadingAnimation}
          size={20}
          autoplay={true}
          loop={true}
          hover={false}
        />
      ) : null}
      {children}
    </button>
  )
}
