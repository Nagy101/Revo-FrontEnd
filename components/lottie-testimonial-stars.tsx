"use client"

import { useEffect } from 'react'
import { LottieIcon } from '@/components/lottie-icon'
import { gsap } from '@/lib/gsap'

// Simple star animation data
const starAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 30,
  "w": 100,
  "h": 100,
  "nm": "Star",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Star",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 1, "k": [
          {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]},
          {"t": 30, "s": [360]}
        ]},
        "p": {"a": 0, "k": [50, 50, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 1, "k": [
          {"i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]}, "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]}, "t": 0, "s": [0, 0, 100]},
          {"i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]}, "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]}, "t": 15, "s": [120, 120, 100]},
          {"t": 30, "s": [100, 100, 100]}
        ]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sr",
              "sy": 1,
              "d": 1,
              "pt": {"a": 0, "k": 5},
              "p": {"a": 0, "k": [0, 0]},
              "r": {"a": 0, "k": 0},
              "ir": {"a": 0, "k": 15},
              "is": {"a": 0, "k": 0},
              "or": {"a": 0, "k": 30},
              "os": {"a": 0, "k": 0}
            },
            {
              "ty": "fl",
              "c": {"a": 0, "k": [1, 0.361, 0, 1]},
              "o": {"a": 0, "k": 100}
            }
          ]
        }
      ],
      "ip": 0,
      "op": 30,
      "st": 0
    }
  ]
}

interface LottieTestimonialStarsProps {
  rating: number
  size?: number
  animated?: boolean
}

export function LottieTestimonialStars({ rating, size = 24, animated = true }: LottieTestimonialStarsProps) {
  useEffect(() => {
    if (animated) {
      gsap.fromTo('.lottie-star', 
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.1,
        }
      )
    }
  }, [animated, rating])

  return (
    <div className="flex justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="lottie-star">
          <LottieIcon
            animationData={starAnimation}
            size={size}
            autoplay={i < rating && animated}
            loop={false}
            hover={true}
          />
        </div>
      ))}
    </div>
  )
}
