"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Show auth page without admin layout
  if (pathname === "/admin/login" || pathname === "/admin/auth") {
    return <div style={{ minHeight: "100vh", background: "#060606" }}>{children}</div>
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#f0f0f0", display: "flex" }}>
      {/* Sidebar handles both desktop (sticky) and mobile (drawer) */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
        <AdminHeader onMobileMenuToggle={() => setMobileOpen(o => !o)} />
        <main style={{ flex: 1, overflowX: "hidden", overflowY: "auto", padding: "24px 20px", background: "#060606" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
