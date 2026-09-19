"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center z-50 relative">
      <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
      <h2 className="text-3xl font-bold text-white mb-4">Something went wrong</h2>
      <p className="text-white/60 mb-8 max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Reload Page
        </Button>
        <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700 text-white">
          Try Again
        </Button>
      </div>
    </div>
  )
}
