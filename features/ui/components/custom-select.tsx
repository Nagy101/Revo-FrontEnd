"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  name?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  required?: boolean
}

export function CustomSelect({ name, value, onChange, options, placeholder = "Select…" }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value?.toLowerCase() === value?.toLowerCase())

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateCoords = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setCoords({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    })
  }, [])

  useEffect(() => {
    if (!open) return
    updateCoords()
    const handleResize = () => updateCoords()
    const handleScroll = (e: Event) => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return
      updateCoords()
    }
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open, updateCoords])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (ref.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const dropdownContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999,
            background: "rgba(12,12,12,0.98)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)",
            maxHeight: 260,
            overflowY: "auto",
          }}
          className="custom-select-scroll"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value?.toLowerCase() === value?.toLowerCase()
            return (
              <motion.button
                key={opt.value}
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.15), duration: 0.16 }}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px",
                  background: isSelected ? "rgba(195,20,61,0.14)" : "transparent",
                  color: isSelected ? "#ff4d6d" : "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem", fontWeight: isSelected ? 700 : 400,
                  border: "none", cursor: "pointer", outline: "none",
                  textAlign: "left", transition: "all 0.15s ease",
                  borderLeft: isSelected ? "2px solid #C3143D" : "2px solid transparent",
                }}
                whileHover={{ background: isSelected ? "rgba(195,20,61,0.18)" : "rgba(255,255,255,0.06)", x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{opt.label}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                      <Check size={14} color="#ff4d6d" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Hidden native input for FormData compatibility */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => {
          if (!open) updateCoords()
          setOpen(o => !o)
        }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: open ? "rgba(195,20,61,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${open ? "#C3143D" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 12, padding: "11px 13px",
          color: selected ? "#fff" : "rgba(255,255,255,0.3)",
          fontSize: "0.9rem", fontWeight: selected ? 500 : 400,
          cursor: "pointer", outline: "none", transition: "all 0.2s ease",
          textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{ flexShrink: 0, marginLeft: 8, color: open ? "#ff4d6d" : "rgba(255,255,255,0.35)", display: "flex" }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      {mounted && typeof document !== "undefined" ? createPortal(dropdownContent, document.body) : dropdownContent}
    </div>
  )
}
