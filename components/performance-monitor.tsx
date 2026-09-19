"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  fps: number
  memory: number
  loadTime: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
          loadTime: Math.round(performance.now()),
        }))

        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${(entry as any).value}`)
      })
    })

    observer.observe({ entryTypes: ["measure", "navigation", "paint"] })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("keydown", handleKeyPress)
      observer.disconnect()
    }
  }, [])

  if (process.env.NODE_ENV !== "development" || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 backdrop-blur-sm">
      <div className="space-y-1">
        <div>
          FPS: <span className={metrics.fps < 30 ? "text-red-400" : "text-green-400"}>{metrics.fps}</span>
        </div>
        <div>
          Memory: <span className="text-blue-400">{metrics.memory}MB</span>
        </div>
        <div>
          Load: <span className="text-yellow-400">{metrics.loadTime}ms</span>
        </div>
      </div>
      <div className="text-gray-400 mt-2 text-[10px]">Ctrl+Shift+P to toggle</div>
    </div>
  )
}
