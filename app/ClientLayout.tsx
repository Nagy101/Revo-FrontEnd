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
import { LanguageProvider } from "@/lib/i18n/language-context"
import dynamic from "next/dynamic"
import SplashScreen from "@/features/ui/components/splash-screen"

const CustomCursor = dynamic(() => import("@/components/effects/custom-cursor").then(m => m.CustomCursor), { ssr: false })

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
  
  const [showSplash, setShowSplash] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isPublicRoute) {
      const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('revo_splash_shown') : null;
      if (!hasSeen) {
        setShowSplash(true);
      } else {
        document.documentElement.classList.remove('splash-pending');
      }
    } else {
      setShowSplash(false);
      document.documentElement.classList.remove('splash-pending');
    }
  }, [isPublicRoute]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    document.documentElement.classList.remove('splash-pending');
    try {
      sessionStorage.setItem('revo_splash_shown', 'true');
    } catch {}
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <GSAPProvider>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            
            <div 
              className="main-site-content"
              style={{ 
                opacity: showSplash ? 0 : 1, 
                visibility: showSplash ? 'hidden' : 'visible',
                transition: 'opacity 0.8s ease-in-out' 
              }}
            >
              {!isAdminRoute && <Navigation />}
              <main>{children}</main>
              {!isAdminRoute && <Footer />}
            </div>
            
            <Toaster />
            {!isAdminRoute && <CustomCursor />}
          </GSAPProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
