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
import dynamic from "next/dynamic"

const CustomCursor = dynamic(() => import("@/components/custom-cursor").then(m => m.CustomCursor), { ssr: false })

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <GSAPProvider>
          {!isAdminRoute && <Navigation />}
          <main className={!isAdminRoute ? "pt-20" : ""}>{children}</main>
          {!isAdminRoute && <Footer />}
          <Toaster />
          <CustomCursor />
        </GSAPProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
