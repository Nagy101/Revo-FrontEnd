"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react"

export function AuthShell() {
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
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
    await new Promise((r) => setTimeout(r, 1200))
    if (email === "admin@revo.com" && password === "admin123") {
      localStorage.setItem("admin-authenticated", "true")
      router.push("/admin")
    } else {
      setError("Invalid credentials. Please try again.")
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  /* ── Shared wordmark ── */
  const Wordmark = ({ size = 1 }: { size?: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 * size }}>
      <div style={{
        width: 30 * size, height: 30 * size, borderRadius: 8 * size,
        background: "#C3143D",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 ${16 * size}px rgba(195,20,61,0.5)`,
        flexShrink: 0,
      }}>
        <svg width={11 * size} height={13 * size} viewBox="0 0 11 13" fill="white">
          <path d="M0.5 1L10.5 6.5L0.5 12V1Z" />
        </svg>
      </div>
      <span style={{
        fontSize: `${1.3 * size}rem`, fontWeight: 800, color: "#fff",
        letterSpacing: "0.1em",
      }}>REVO</span>
    </div>
  )

  /* ── Login form ── */
  const LoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}
    >
      {/* Brand mark — R */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 160, damping: 14 }}
        style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: "linear-gradient(135deg, rgba(195,20,61,0.15) 0%, rgba(195,20,61,0.05) 100%)",
          border: "1px solid rgba(195,20,61,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(195,20,61,0.08), 0 8px 32px rgba(195,20,61,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Inner glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(195,20,61,0.2) 0%, transparent 70%)",
          }} />
          <span style={{
            fontSize: "2.2rem", fontWeight: 900, color: "#C3143D",
            fontFamily: "var(--font-sora), sans-serif",
            lineHeight: 1,
            position: "relative", zIndex: 1,
            textShadow: "0 0 20px rgba(195,20,61,0.6)",
            letterSpacing: "-0.02em",
          }}>R</span>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 20 }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
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
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8, marginLeft: 2 }}>
            Email Address
          </label>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            borderRadius: 12, transition: "all 0.2s",
            border: `1px solid ${focused === "email" ? "rgba(195,20,61,0.6)" : "rgba(255,255,255,0.09)"}`,
            background: "rgba(255,255,255,0.03)",
            boxShadow: focused === "email" ? "0 0 0 3px rgba(195,20,61,0.06)" : "none",
          }}>
            <Mail style={{ position: "absolute", left: 14, width: 16, height: 16, color: focused === "email" ? "#C3143D" : "rgba(255,255,255,0.22)", transition: "color 0.2s" }} />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              placeholder="you@example.com" required
              style={{ width: "100%", height: 46, paddingLeft: 44, paddingRight: 16, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.9rem" }}
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.58 }}>
          <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8, marginLeft: 2 }}>
            Password
          </label>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            borderRadius: 12, transition: "all 0.2s",
            border: `1px solid ${focused === "password" ? "rgba(195,20,61,0.6)" : "rgba(255,255,255,0.09)"}`,
            background: "rgba(255,255,255,0.03)",
            boxShadow: focused === "password" ? "0 0 0 3px rgba(195,20,61,0.06)" : "none",
          }}>
            <Lock style={{ position: "absolute", left: 14, width: 16, height: 16, color: focused === "password" ? "#C3143D" : "rgba(255,255,255,0.22)", transition: "color 0.2s" }} />
            <input
              type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              placeholder="••••••••" required
              style={{ width: "100%", height: 46, paddingLeft: 44, paddingRight: 46, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.9rem" }}
            />
            <button type="button" onClick={() => setShowPass(!showPassword)}
              style={{ position: "absolute", right: 10, padding: 6, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
            >
              {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <button type="button" style={{ background: "none", border: "none", color: "#C3143D", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer" }}>
              Forgot Password?
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.66 }} style={{ paddingTop: 4 }}>
          <button
            type="submit" disabled={isLoading}
            style={{
              width: "100%", height: 48, borderRadius: 12, border: "none",
              background: "#C3143D",
              color: "#fff", fontWeight: 600, fontSize: "0.95rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.75 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 24px rgba(195,20,61,0.3)",
              transition: "background 0.2s, box-shadow 0.2s",
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

      {/* Security hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{
          marginTop: 28, padding: "12px 16px", borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.015)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck style={{ width: 14, height: 14, color: "rgba(195,20,61,0.5)" }} />
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>Your data is secure with us</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>admin@revo.com</div>
          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>admin123</div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", flexDirection: "column" }}
      className="font-sans auth-root selection:bg-[#C3143D]/30"
    >
      {/* ══ MOBILE HERO (hidden on desktop) ══ */}
      <div className="auth-mobile-hero" style={{ position: "relative", height: 240, overflow: "hidden", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/auth-bg.jpg" alt="" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Dark overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.4) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(195,20,61,0.08)", mixBlendMode: "multiply" as const }} />
        {/* Wordmark in hero */}
        <div style={{ position: "absolute", top: 28, left: 24 }}>
          <Wordmark size={1} />
        </div>
        {/* Welcome text */}
        <div style={{ position: "absolute", bottom: 28, left: 24 }}>
          <div style={{ width: 28, height: 2.5, background: "#C3143D", borderRadius: 9999, marginBottom: 10 }} />
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Welcome Back</div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            Glad to see you again.
          </div>
        </div>
      </div>

      {/* ══ DESKTOP + MOBILE form wrapper ══ */}
      <div className="auth-layout" style={{ flex: 1, display: "flex" }}>

        {/* Desktop left panel */}
        <div className="auth-left-panel" style={{ position: "relative", flexShrink: 0, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/auth-bg.jpg" alt="Revo Studio"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #060606 0%, rgba(6,6,6,0.5) 55%, rgba(6,6,6,0.2) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #060606 100%)" }} />

          {/* Content */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem", zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Wordmark size={1.1} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div style={{ width: 36, height: 3, background: "#C3143D", borderRadius: 9999, marginBottom: 20 }} />
              <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
                Welcome<br />Back
              </h2>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 210 }}>
                Glad to see you again.<br />Let's continue where you left off.
              </p>
              <p style={{ color: "rgba(255,255,255,0.16)", fontSize: "0.68rem", marginTop: 52, letterSpacing: "0.04em" }}>
                © {new Date().getFullYear()} REVO Media Production
              </p>
            </motion.div>
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
            style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(195,20,61,0.1) 0%, transparent 65%)", pointerEvents: "none" }}
          />
          <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 10 }}>
            <LoginForm />
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
            width: 42% !important;
            min-height: 100vh !important;
          }
        }

        /* Mobile */
        @media (max-width: 1023px) {
          .auth-mobile-hero { display: block !important; }
          .auth-left-panel { display: none !important; }
          .auth-layout { flex-direction: column !important; }
        }

        input::placeholder { color: rgba(255,255,255,0.2) !important; }
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
