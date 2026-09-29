"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, FolderOpen, Tags, Wrench,
  Users, MessageSquare, BarChart3, LogOut,
  ChevronLeft, ChevronRight, X,
} from "lucide-react"

const navItems = [
  { title: "Dashboard",        href: "/admin",            icon: LayoutDashboard },
  { title: "Portfolio",        href: "/admin/portfolio",  icon: FolderOpen      },
  { title: "Categories",       href: "/admin/categories", icon: Tags            },
  { title: "Services",         href: "/admin/services",   icon: Wrench          },
  { title: "Contact Requests", href: "/admin/contact-requests", icon: MessageSquare   },
  { title: "Analytics",        href: "/admin/analytics",  icon: BarChart3       },
]

/* ─── Shared nav content ─── */
function NavContent({
  collapsed,
  onClose,
  pathname,
  onLogout,
  onToggleCollapse,
}: {
  collapsed: boolean
  onClose?: () => void
  pathname: string
  onLogout: () => void
  onToggleCollapse?: () => void
}) {
  return (
    <>
      {/* Logo row */}
      <div style={{
        height: 64, display: "flex", alignItems: "center",
        padding: "0 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        gap: 10, flexShrink: 0, position: "relative",
      }}>
        {/* R icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #C3143D, #8f0f2c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, boxShadow: "0 0 16px rgba(195,20,61,0.3)",
        }}>
          <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
            <path d="M1 1H7.5C9.7 1 11.5 2.8 11.5 5C11.5 6.8 10.4 8.3 8.8 8.8L11.5 13H8.5L5.5 9H4V13H1V1Z" />
          </svg>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}
            >
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>REVO</div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Panel</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop collapse button */}
        {!onClose && (
          <button
            onClick={onToggleCollapse}
            style={{
              position: "absolute",
              right: -12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              flexShrink: 0,
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {collapsed
              ? <ChevronRight style={{ width: 14, height: 14, marginLeft: 2 }} />
              : <ChevronLeft style={{ width: 14, height: 14, marginRight: 2 }} />
            }
          </button>
        )}

        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} style={{
            marginLeft: "auto",
            width: 30, height: 30, borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.5)",
          }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
          const Icon = item.icon
          return (
            <motion.div key={item.href}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link href={item.href} onClick={onClose} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: collapsed ? 0 : 11,
                  padding: "9px 10px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 9,
                  background: isActive ? "rgba(195,20,61,0.1)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(195,20,61,0.22)" : "transparent"}`,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                  transition: "all 0.18s",
                  position: "relative", overflow: "hidden", cursor: "pointer",
                }}>
                  {/* Active bar */}
                  {isActive && (
                    <motion.div layoutId="sidebar-active-bar" style={{
                      position: "absolute", left: 0, top: "18%", bottom: "18%",
                      width: 3, borderRadius: 9999,
                      background: "#C3143D", boxShadow: "0 0 8px rgba(195,20,61,0.5)",
                    }} />
                  )}
                  <Icon style={{ width: 17, height: 17, flexShrink: 0, color: isActive ? "#C3143D" : "inherit" }} />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                        style={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <button onClick={onLogout} style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: collapsed ? 0 : 11,
          padding: "9px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 9, border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer", fontSize: "0.875rem", transition: "all 0.18s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(195,20,61,0.08)"; e.currentTarget.style.color = "#F04F6A" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.3)" }}
        >
          <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                style={{ whiteSpace: "nowrap" }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  )
}

/* ─── Main export ─── */
export function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated")
    router.push("/admin/auth")
    onMobileClose?.()
  }

  return (
    <>
      {/* ── DESKTOP sidebar (≥ 1024px) ── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 232 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: "100vh", position: "sticky", top: 0, flexShrink: 0,
          flexDirection: "column",
          background: "#0a0a0a",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          overflow: "visible", zIndex: 50,
        }}
        className="desktop-sidebar"
      >
        <DesktopNavContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </motion.aside>

      <style jsx global>{`
        .desktop-sidebar {
          display: none !important;
        }
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: flex !important;
          }
        }
      `}</style>

      {/* ── MOBILE drawer (< 1024px) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onMobileClose}
              style={{
                position: "fixed", inset: 0, zIndex: 100,
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
              }}
              className="lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", left: 0, top: 0, bottom: 0,
                width: 260, zIndex: 101,
                background: "#0a0a0a",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column",
              }}
              className="lg:hidden"
            >
              <NavContent
                collapsed={false}
                onClose={onMobileClose}
                pathname={pathname}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* Desktop-specific wrapper that adds the collapse button handler */
function DesktopNavContent({
  collapsed, setCollapsed, pathname, onLogout,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean | ((p: boolean) => boolean)) => void
  pathname: string
  onLogout: () => void
}) {
  return (
    <NavContent 
      collapsed={collapsed} 
      pathname={pathname} 
      onLogout={onLogout} 
      onToggleCollapse={() => setCollapsed(c => !c)}
    />
  )
}
