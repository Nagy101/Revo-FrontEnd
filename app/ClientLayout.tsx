"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GSAPProvider } from "@/components/gsap-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dynamic from "next/dynamic"

const CustomCursor = dynamic(() => import("@/components/effects/custom-cursor").then(m => m.CustomCursor), { ssr: false })

const SplashScreen = dynamic(() => import("@/features/ui/components/splash-screen"), { ssr: false })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  const isPublicRoute = !isAdminRoute;
  
  const [showSplash, setShowSplash] = useState(isPublicRoute);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isPublicRoute) {
      setShowSplash(false);
    }
  }, [isPublicRoute]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <GSAPProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          
          <div style={{ 
            opacity: showSplash ? 0 : 1, 
            visibility: showSplash ? 'hidden' : 'visible',
            transition: 'opacity 0.8s ease-in-out' 
          }}>
            {!isAdminRoute && <Navigation />}
            <main>{children}</main>
            {!isAdminRoute && <Footer />}
          </div>
          
          <Toaster />
          <CustomCursor />
        </GSAPProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
