"use client"

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  skip = false,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (skip || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        if (triggerOnce && hasIntersected) {
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(elementRef.current)

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, skip, hasIntersected])

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  }
}

export function useMultipleIntersectionObserver(
  elementsCount: number,
  options: UseIntersectionObserverOptions = {}
) {
  const [intersections, setIntersections] = useState<boolean[]>(
    new Array(elementsCount).fill(false)
  )
  const elementRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (options.skip) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elementRefs.current.findIndex(
            (ref) => ref === entry.target
          )
          if (index !== -1) {
            setIntersections((prev) => {
              const newIntersections = [...prev]
              newIntersections[index] = entry.isIntersecting
              return newIntersections
            })
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    )

    elementRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      elementRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [elementsCount, options])

  const setElementRef = (index: number) => (element: HTMLElement | null) => {
    elementRefs.current[index] = element
  }

  return {
    intersections,
    setElementRef,
  }
}
