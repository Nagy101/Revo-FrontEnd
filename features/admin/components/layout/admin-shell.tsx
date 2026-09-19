"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()

  // Show auth page without admin layout
  if (pathname === "/admin/login" || pathname === "/admin/auth") {
    return <div className="min-h-screen bg-black">{children}</div>
  }

  // Show admin layout
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
