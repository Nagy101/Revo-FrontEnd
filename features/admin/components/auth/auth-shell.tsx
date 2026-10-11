"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Lock, Mail } from "lucide-react"

import { authService } from "@/lib/auth.service"

export function AuthShell() {
  const [email, setEmail]           = useState("admin1@revo.com")
  const [password, setPassword]     = useState("Password@123")
  const [showPassword, setShowPass] = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const [error, setError]           = useState("")
  const [isMounted, setIsMounted]   = useState(false)
  const [focused, setFocused]       = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => { setIsMounted(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await authService.login({ email, password });

      if (response.isSuccess && response.data.isAuthenticated) {
        authService.setAuthData(response.data);
        router.push("/admin")
      } else {
        setError("Email or password is wrong.")
      }
    } catch (err: any) {
      setError("Email or password is wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  /* ── Official Brand Wordmark ── */
  const Wordmark = () => (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
      <img
        src="/images/revo-logo.png"
        alt="REVO Media Production"
        style={{
          height: 36,
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 4px 16px rgba(195,20,61,0.45))",
        }}
      />
    </Link>
  )

  /* ── Login form ── */
  const LoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}
    >
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 160, damping: 14 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}
      >
        <Link href="/" style={{ display: "inline-block", textDecoration: "none" }}>
          <img
            src="/images/revo-logo.png"
            alt="REVO"
            style={{
              height: 44,
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 4px 20px rgba(195,20,61,0.5))",
            }}
          />
        </Link>
        <h3 style={{ 
          fontSize: "1.35rem", 
          fontWeight: 700, 
          color: "#fff", 
          marginTop: 18, 
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-sora), sans-serif" 
        }}>
          Admin Portal
        </h3>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginTop: 4, fontWeight: 300 }}>
          Sign in to manage REVO production systems
        </p>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 20 }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            }}>
              <AlertCircle style={{ width: 16, height: 16, color: "#F04F6A", flexShrink: 0 }} />
              <span style={{ color: "#F04F6A", fontSize: "0.8rem", fontWeight: 500 }}>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Email */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8, marginLeft: 2 }}>
            Email Address
          </label>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            borderRadius: 12, transition: "all 0.2s",
            border: `1px solid ${focused === "email" ? "rgba(195,20,61,0.7)" : "rgba(255,255,255,0.1)"}`,
            background: "rgba(255,255,255,0.03)",
            boxShadow: focused === "email" ? "0 0 0 3px rgba(195,20,61,0.12)" : "none",
          }}>
            <Mail style={{ position: "absolute", left: 14, width: 16, height: 16, color: focused === "email" ? "#C3143D" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }} />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              placeholder="admin1@revo.com" required
              style={{ width: "100%", height: 46, paddingLeft: 44, paddingRight: 16, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.9rem" }}
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.48 }}>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8, marginLeft: 2 }}>
            Password
          </label>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            borderRadius: 12, transition: "all 0.2s",
            border: `1px solid ${focused === "password" ? "rgba(195,20,61,0.7)" : "rgba(255,255,255,0.1)"}`,
            background: "rgba(255,255,255,0.03)",
            boxShadow: focused === "password" ? "0 0 0 3px rgba(195,20,61,0.12)" : "none",
          }}>
            <Lock style={{ position: "absolute", left: 14, width: 16, height: 16, color: focused === "password" ? "#C3143D" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }} />
            <input
              type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              placeholder="••••••••••••" required
              style={{ width: "100%", height: 46, paddingLeft: 44, paddingRight: 46, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.9rem" }}
            />
            <button type="button" onClick={() => setShowPass(!showPassword)}
              style={{ position: "absolute", right: 10, padding: 6, background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}
            >
              {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }} style={{ paddingTop: 6 }}>
          <button
            type="submit" disabled={isLoading}
            style={{
              width: "100%", height: 48, borderRadius: 12, border: "none",
              background: "#C3143D",
              color: "#fff", fontWeight: 600, fontSize: "0.95rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.75 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 24px rgba(195,20,61,0.45)",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? (
              <>
                <svg style={{ width: 18, height: 18, animation: "spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight style={{ width: 18, height: 18 }} />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", flexDirection: "column" }}
      className="font-sans auth-root selection:bg-[#C3143D] selection:text-white"
    >
      {/* ══ MOBILE HERO (hidden on desktop) ══ */}
      <div className="auth-mobile-hero" style={{ position: "relative", height: 260, overflow: "hidden", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/revo-hero-bg.jpg" alt="REVO Production" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
        />
        {/* Dark overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.6) 50%, rgba(6,6,6,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(195,20,61,0.12)", mixBlendMode: "color-dodge" as const }} />
        
        {/* Top bar */}
        <div style={{ position: "absolute", top: 20, left: 20, right: 20, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
          {Wordmark()}
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", textDecoration: "none", padding: "6px 14px", background: "rgba(0,0,0,0.6)", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
            ← Website
          </Link>
        </div>

        {/* Welcome text */}
        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <div style={{ width: 28, height: 3, background: "#C3143D", borderRadius: 9999, marginBottom: 8 }} />
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, fontFamily: "var(--font-sora), sans-serif" }}>
            Every Frame Has A Story
          </div>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            REVO Media Production Control Center
          </div>
        </div>
      </div>

      {/* ══ DESKTOP + MOBILE form wrapper ══ */}
      <div className="auth-layout" style={{ flex: 1, display: "flex" }}>

        {/* Desktop left panel */}
        <div className="auth-left-panel" style={{ position: "relative", flexShrink: 0, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/revo-hero-bg.jpg" alt="REVO Concert Atmosphere"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%" }}
          />
          {/* Gradients */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.6) 45%, rgba(6,6,6,0.3) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, #060606 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(195,20,61,0.08)", mixBlendMode: "color-dodge" as const }} />

          {/* Left Panel Content */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3rem", zIndex: 10 }}>
            
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              {Wordmark()}
              <Link 
                href="/" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 6, 
                  padding: "8px 16px", 
                  borderRadius: 9999, 
                  background: "rgba(0,0,0,0.6)", 
                  border: "1px solid rgba(255,255,255,0.15)", 
                  color: "rgba(255,255,255,0.85)", 
                  fontSize: "0.78rem", 
                  fontWeight: 600, 
                  textDecoration: "none",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.2s" 
                }}
              >
                <ArrowLeft style={{ width: 14, height: 14, color: "#C3143D" }} />
                <span>Back to website</span>
              </Link>
            </div>

            {/* Inspiring Editorial Typography */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 8, 
                padding: "6px 12px", 
                borderRadius: 9999, 
                background: "rgba(195,20,61,0.15)", 
                border: "1px solid rgba(195,20,61,0.3)", 
                marginBottom: 20 
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C3143D", boxShadow: "0 0 8px #C3143D" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#F04F6A", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
                  Live Production Console
                </span>
              </div>

              <h2 style={{ fontSize: "clamp(2.2rem,3.4vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16, fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}>
                Every Frame<br />
                <span style={{ 
                  background: "linear-gradient(to right, #ffffff, #fecdd3, #C3143D)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent" 
                }}>
                  Has A Story.
                </span>
              </h2>

              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 380, fontWeight: 300 }}>
                Direct live concert broadcasts, manage high-impact portfolios, and elevate brand narratives with cinematic excellence.
              </p>

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ height: 2, width: 32, background: "#C3143D", borderRadius: 9999 }} />
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                  Concert Production &amp; Visual Storytelling
                </span>
              </div>
            </motion.div>

            {/* Bottom line */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>System Active</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", letterSpacing: "0.04em", fontFamily: "monospace" }}>
                © {new Date().getFullYear()} REVO MEDIA PRODUCTION
              </span>
            </div>
          </div>
        </div>

        {/* Form area — shared desktop + mobile */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 24px", position: "relative", overflowY: "auto",
        }}>
          {/* ambient glow */}
          <motion.div
            animate={{ opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(195,20,61,0.12) 0%, transparent 65%)", pointerEvents: "none" }}
          />
          <div style={{ width: "100%", maxWidth: 390, position: "relative", zIndex: 10 }}>
            {LoginForm()}
          </div>
        </div>
      </div>

      {/* ══ CSS ══ */}
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Desktop */
        @media (min-width: 1024px) {
          .auth-root { flex-direction: row !important; }
          .auth-layout { flex-direction: row !important; }
          .auth-mobile-hero { display: none !important; }
          .auth-left-panel {
            display: block !important;
            width: 48% !important;
            min-height: 100vh !important;
          }
        }

        /* Mobile */
        @media (max-width: 1023px) {
          .auth-mobile-hero { display: block !important; }
          .auth-left-panel { display: none !important; }
          .auth-layout { flex-direction: column !important; }
        }

        input::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #111 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  )
}
