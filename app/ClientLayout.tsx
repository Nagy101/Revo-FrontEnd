"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GSAPProvider } from "@/components/gsap-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LanguageProvider } from "@/lib/i18n/language-context"
import dynamic from "next/dynamic"

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
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <GSAPProvider>
            <div className="main-site-content">
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
