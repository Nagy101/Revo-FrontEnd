"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, LogOut, Settings, X } from "lucide-react"
import { NotificationBell } from "./notification-bell"

const breadcrumbMap: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/portfolio":  "Portfolio",
  "/admin/categories": "Categories",
  "/admin/services":   "Services",
  "/admin/clients":    "Clients",
  "/admin/contact":    "Contact Requests",
  "/admin/analytics":  "Analytics",
}

export function AdminHeader({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  const router   = useRouter()
  const pathname = usePathname()

  const pageName = breadcrumbMap[pathname ?? ""] ?? "Dashboard"

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/lib/auth.service');
      authService.logout();
      router.push("/admin/auth");
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "sticky", top: 0, zIndex: 40,
        flexShrink: 0, gap: 12,
      }}
    >
      {/* Left — Hamburger (mobile) + Page title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMobileMenuToggle}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.6)", flexShrink: 0,
            }}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect y="0" width="16" height="2" rx="1" />
              <rect y="5" width="10" height="2" rx="1" />
              <rect y="10" width="13" height="2" rx="1" />
            </svg>
          </motion.button>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.h1
              key={pageName}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
              style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff", margin: 0 }}
            >
              {pageName}
            </motion.h1>
          </AnimatePresence>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.28)", margin: 0 }}>
            REVO Media Production
          </p>
        </div>
      </div>

      {/* Center — Search (desktop) */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 280 }}
        className="hidden md:block"
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, padding: "0 14px", height: 38,
          transition: "border-color 0.2s",
        }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(195,20,61,0.3)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
        >
          <Search style={{ width: 15, height: 15, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: "0.85rem", width: "100%",
            }}
          />
          {searchVal && (
            <button onClick={() => setSearchVal("")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      </div>

      {/* Right — Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Notifications */}
        <NotificationBell />

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.07)" }} />

        {/* Profile */}
        <div style={{ position: "relative" }}>
          <motion.button
            onClick={() => setProfileOpen(!profileOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 12px 6px 6px",
              borderRadius: 12,
              background: profileOpen ? "rgba(255,255,255,0.06)" : "transparent",
              border: `1px solid ${profileOpen ? "rgba(255,255,255,0.1)" : "transparent"}`,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #C3143D, #8f0f2c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px rgba(195,20,61,0.25)",
              flexShrink: 0,
            }}>
              <User style={{ width: 15, height: 15, color: "#fff" }} />
            </div>
            <div style={{ textAlign: "left" }} className="hidden md:block">
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>Admin</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>admin@revo.com</div>
            </div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    width: 200, zIndex: 50,
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    padding: "6px",
                  }}
                >
                  {[
                    { icon: User,     label: "Profile",  action: () => setProfileOpen(false) },
                    { icon: Settings, label: "Settings", action: () => setProfileOpen(false) },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", borderRadius: 9,
                        background: "none", border: "none",
                        color: "rgba(255,255,255,0.6)", cursor: "pointer",
                        fontSize: "0.85rem", transition: "all 0.15s", textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                        e.currentTarget.style.color = "#fff"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none"
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                      }}
                    >
                      <Icon style={{ width: 15, height: 15 }} />
                      {label}
                    </button>
                  ))}

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", borderRadius: 9,
                      background: "none", border: "none",
                      color: "#F04F6A", cursor: "pointer",
                      fontSize: "0.85rem", transition: "all 0.15s", textAlign: "left",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(195,20,61,0.1)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none" }}
                  >
                    <LogOut style={{ width: 15, height: 15 }} />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
