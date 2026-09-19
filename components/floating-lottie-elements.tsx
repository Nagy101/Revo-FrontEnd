"use client"

import { useEffect } from 'react'
import { LottieIcon } from '@/components/lottie-icon'
import { serviceAnimations, loadingAnimation } from '@/lib/lottie-animations'
import { gsap } from '@/lib/gsap'

export function FloatingLottieElements() {
  useEffect(() => {
    // Animate floating elements
    gsap.to('.floating-lottie-1', {
      y: -30,
      x: 20,
      rotation: 10,
      duration: 6,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    })

    gsap.to('.floating-lottie-2', {
      y: -20,
      x: -15,
      rotation: -5,
      duration: 8,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2,
    })

    gsap.to('.floating-lottie-3', {
      y: -25,
      x: 10,
      rotation: 8,
      duration: 7,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 4,
    })

    // Parallax effect
    gsap.to('.floating-lottie-1', {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    gsap.to('.floating-lottie-2', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    gsap.to('.floating-lottie-3', {
      yPercent: -70,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Lottie Element 1 */}
      <div className="floating-lottie-1 absolute top-1/4 right-10 opacity-10">
        <LottieIcon
          animationData={serviceAnimations['Video Production']}
          size={120}
          autoplay={true}
          loop={true}
          hover={false}
        />
      </div>

      {/* Floating Lottie Element 2 */}
      <div className="floating-lottie-2 absolute top-1/2 left-10 opacity-8">
        <LottieIcon
          animationData={serviceAnimations['Photography']}
          size={100}
          autoplay={true}
          loop={true}
          hover={false}
        />
      </div>

      {/* Floating Lottie Element 3 */}
      <div className="floating-lottie-3 absolute bottom-1/4 right-1/4 opacity-12">
        <LottieIcon
          animationData={loadingAnimation}
          size={80}
          autoplay={true}
          loop={true}
          hover={false}
        />
      </div>
    </div>
  )
}
