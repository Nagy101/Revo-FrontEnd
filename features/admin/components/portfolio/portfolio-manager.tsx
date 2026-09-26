"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Edit2, Trash2, Image as ImageIcon, Video,
  CheckCircle2, AlertCircle, X, Loader2, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Film, Eye
} from "lucide-react"

import { usePortfolios, usePortfolioDetails, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from "@/features/portfolio/hooks/usePortfolios"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { PortfolioMedia, MediaType, PortfolioPayload } from "@/features/portfolio/types"
import { CustomSelect } from "@/features/ui/components/custom-select"

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } } }

// ─── Toast ────────────────────────────────────────────────────────────────────
function CustomToast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  const isSuccess = type === "success"
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
        border: `1px solid ${isSuccess ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
        boxShadow: `0 16px 50px ${isSuccess ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}, 0 4px 16px rgba(0,0,0,0.4)`,
        borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 280,
      }}
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}>
        {isSuccess ? <CheckCircle2 color="#22c55e" size={20} /> : <AlertCircle color="#ef4444" size={20} />}
      </motion.div>
      <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }} className="hover:bg-white/15 hover:text-white"><X size={14} /></button>
    </motion.div>
  )
}

// ─── Media Block ──────────────────────────────────────────────────────────────
function MediaBlock({ media, index, isFirst, isLast, onUpdate, onRemove, onMoveUp, onMoveDown }: {
  media: PortfolioMedia; index: number; isFirst: boolean; isLast: boolean
  onUpdate: (m: PortfolioMedia) => void; onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      onUpdate({ ...media, file, mediaUrl: URL.createObjectURL(file) })
    }
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 14, display: "flex", gap: 14, alignItems: "center", transition: "border-color 0.2s, background 0.2s" }}
      className="hover:border-white/[0.1] hover:bg-white/[0.03]"
    >
      {/* Preview Dropzone */}
      <motion.div whileHover={{ scale: 1.04 }} style={{ position: "relative", width: 78, height: 78, borderRadius: 12, background: "#0a0a0a", overflow: "hidden", flexShrink: 0, border: "1px dashed rgba(255,255,255,0.12)", cursor: "pointer" }}>
        {(media.mediaUrl || media.coverImageUrl) ? (
          <img src={media.coverImageUrl || media.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", gap: 4 }}>
            {media.type === MediaType.Image ? <ImageIcon size={18} /> : <Video size={18} />}
            <span style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Upload</span>
          </div>
        )}
        <input type="file" accept={media.type === MediaType.Image ? "image/*" : "video/*"} onChange={handleFile} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
      </motion.div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px", minWidth: 120 }}>
            <CustomSelect
              value={String(media.type)}
              onChange={v => onUpdate({ ...media, type: Number(v) })}
              options={[
                { value: String(MediaType.Image), label: "🖼  Image" },
                { value: String(MediaType.Video), label: "🎬  Video" },
              ]}
            />
          </div>

          {media.type === MediaType.Video && (
            <div style={{ flex: "1 1 200px" }}>
              <input
                type="url"
                placeholder="Video URL (e.g. YouTube)"
                value={media.videoUrl || ""}
                onChange={e => onUpdate({ ...media, videoUrl: e.target.value })}
                required={!media.id}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 11px", color: "#fff", fontSize: "0.82rem", outline: "none", width: "100%" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#C3143D" }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {[
              { onClick: onMoveUp, disabled: isFirst, icon: <ArrowUp size={13} /> },
              { onClick: onMoveDown, disabled: isLast, icon: <ArrowDown size={13} /> },
            ].map((btn, i) => (
              <motion.button key={i} type="button" whileHover={!btn.disabled ? { scale: 1.1 } : {}} whileTap={!btn.disabled ? { scale: 0.92 } : {}} onClick={btn.onClick} disabled={btn.disabled} style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(255,255,255,0.04)", color: btn.disabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)", cursor: btn.disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {btn.icon}
              </motion.button>
            ))}
            <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onRemove} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(239,68,68,0.18)", background: "rgba(239,68,68,0.07)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
              <Trash2 size={13} />
            </motion.button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {media.file ? (
            <motion.span key="file" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ fontSize: "0.71rem", color: "#10b981", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle2 size={11} /> {media.file.name}</motion.span>
          ) : media.id ? (
            <motion.span key="existing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.28)" }}>Existing media · from server</motion.span>
          ) : (
            <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "0.71rem", color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={11} /> {media.type === MediaType.Video ? "Please upload a cover image" : "Please upload a file"}</motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function PortfolioModal({ isOpen, mode, id, onClose, showToast }: {
  isOpen: boolean; mode: "create" | "edit"; id: string | null
  onClose: () => void; showToast: (m: string, t?: "success" | "error") => void
}) {
  const { data: catRes } = useCategories(1, 100)
  const categories = catRes?.data?.data || []
  const { data: detailRes, isLoading: loadingDetails } = usePortfolioDetails(mode === "edit" ? id : null)
  const portfolio = detailRes?.data
  const createMutation = useCreatePortfolio()
  const updateMutation = useUpdatePortfolio()
  const [mediaItems, setMediaItems] = useState<PortfolioMedia[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  useEffect(() => {
    if (mode === "edit" && portfolio) {
      setMediaItems(portfolio.mediaItems?.map(m => ({ 
        ...m,
        videoUrl: m.type === MediaType.Video ? m.mediaUrl : m.videoUrl
      })) || [])
      setSelectedCategory(portfolio.categoryId)
    }
    if (mode === "create") {
      setMediaItems([])
      setSelectedCategory(categories.length > 0 ? categories[0].id : "")
    }
  }, [portfolio, mode, isOpen, categories])

  const handleApiError = (error: any) => {
    const errorData = error?.data
    let msg = errorData?.title || errorData?.message || error.message || "Something went wrong"
    
    if (errorData?.errors) {
      if (Array.isArray(errorData.errors)) {
        if (errorData.errors.length > 0) {
          msg = errorData.errors[0].message || errorData.errors[0].errorMessage || msg
        }
      } else if (typeof errorData.errors === 'object') {
        msg = Object.values(errorData.errors).flat()[0] as string || msg
      }
    }
    showToast(msg, 'error')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (mediaItems.length === 0) {
      showToast("Please add at least one media item.", "error")
      return
    }

    if (!mediaItems.every(m => m.id || m.file || (m.type === MediaType.Video && m.videoUrl))) {
      showToast("Please upload a file or provide a video URL.", "error")
      return
    }

    const fd = new FormData(e.currentTarget)
    const payload: PortfolioPayload = {
      captionAr: fd.get("captionAr") as string,
      captionEn: fd.get("captionEn") as string,
      orderIndex: Number(fd.get("orderIndex") || 1),
      categoryId: fd.get("categoryId") as string,
      mediaItems: mediaItems.map((m, i) => ({ ...m, orderIndex: i + 1 })),
    }
    if (mode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => { showToast("Portfolio item created!"); onClose() },
        onError: handleApiError,
      })
    } else {
      updateMutation.mutate({ id: id!, payload }, {
        onSuccess: () => { showToast("Portfolio item updated!"); onClose() },
        onError: handleApiError,
      })
    }
  }

  const addMedia = () => setMediaItems(p => [...p, { type: MediaType.Image, orderIndex: p.length + 1 }])
  const removeMedia = (i: number) => setMediaItems(p => p.filter((_, idx) => idx !== i))
  const updateMedia = (i: number, m: PortfolioMedia) => setMediaItems(p => { const n = [...p]; n[i] = m; return n })
  const swapMedia = (a: number, b: number) => setMediaItems(p => { const n = [...p]; [n[a], n[b]] = [n[b], n[a]]; return n })

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <motion.div
        variants={scaleIn} initial="hidden" animate="show" exit="hidden"
        style={{ background: "rgba(12, 12, 12, 0.95)", backdropFilter: "blur(40px) saturate(150%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, width: "100%", maxWidth: 680, maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        {/* Modal Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, rgba(195,20,61,0.15), rgba(143,15,44,0.05))", border: "1px solid rgba(195,20,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <Film size={20} color="#ff4d6d" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", fontWeight: 700, letterSpacing: "-0.01em" }}>{mode === "create" ? "New Masterpiece" : "Edit Masterpiece"}</h2>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Curate your portfolio with stunning media.</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.08, rotate: 90, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.92 }} transition={{ duration: 0.2 }} onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </motion.button>
        </div>

        {/* Modal Body */}
        {mode === "edit" && loadingDetails ? (
          <div style={{ padding: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Loader2 className="animate-spin" color="#C3143D" size={38} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", fontWeight: 500 }}>Loading project details…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 24 }} className="custom-scrollbar">
            {/* Captions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {([
                { name: "captionEn", label: "Title (English)", placeholder: "e.g. Summer Campaign", defaultVal: portfolio?.captionEn, dir: "ltr" },
                { name: "captionAr", label: "Title (Arabic)", placeholder: "مثال: حملة الصيف", defaultVal: portfolio?.captionAr, dir: "rtl" },
              ] as const).map((f, fi) => (
                <motion.div key={f.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fi * 0.06 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                  <input name={f.name} required defaultValue={f.defaultVal} placeholder={f.placeholder} dir={f.dir} className="hover:bg-white/[0.04] transition-all duration-200" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: "0.95rem", outline: "none", width: "100%", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }} onFocus={e => { e.currentTarget.style.borderColor = "#C3143D"; e.currentTarget.style.background = "rgba(195,20,61,0.03)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(195,20,61,0.15)" }} onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)" }} />
                </motion.div>
              ))}
            </div>

            {/* Category + Order */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }} className="hover:bg-white/[0.04] transition-all duration-200 focus-within:border-[#C3143D] focus-within:ring-[3px] focus-within:ring-[#C3143D]/15">
                  <CustomSelect
                    name="categoryId"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categories.map(c => ({ value: c.id, label: c.nameEn }))}
                    placeholder="Select Category"
                    required
                  />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sort Order</label>
                <input name="orderIndex" type="number" defaultValue={portfolio?.orderIndex || 1} required className="hover:bg-white/[0.04] transition-all duration-200" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: "0.95rem", outline: "none", width: "100%", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }} onFocus={e => { e.currentTarget.style.borderColor = "#C3143D"; e.currentTarget.style.background = "rgba(195,20,61,0.03)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(195,20,61,0.15)" }} onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)" }} />
              </motion.div>
            </div>

            {/* Media Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>Media Gallery</span>
                  {mediaItems.length > 0 && (
                    <span style={{ marginLeft: 10, fontSize: "0.75rem", color: "#ff4d6d", background: "rgba(195,20,61,0.1)", border: "1px solid rgba(195,20,61,0.2)", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>{mediaItems.length} file{mediaItems.length > 1 ? "s" : ""}</span>
                  )}
                </div>
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addMedia} style={{ background: "rgba(195,20,61,0.15)", color: "#ff4d6d", border: "1px solid rgba(195,20,61,0.3)", borderRadius: 10, padding: "8px 16px", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-[#C3143D] hover:text-white hover:border-[#C3143D] hover:shadow-[0_4px_15px_rgba(195,20,61,0.4)]">
                  <Plus size={14} /> Add Media
                </motion.button>
              </div>
              <AnimatePresence mode="popLayout">
                {mediaItems.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group hover:border-[#C3143D]/50 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer" onClick={addMedia} style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.015)", borderRadius: 16, border: "2px dashed rgba(255,255,255,0.08)" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }} className="group-hover:bg-[#C3143D]/10 group-hover:text-[#ff4d6d] transition-colors duration-300">
                      <Film size={28} className="text-white/20 group-hover:text-[#ff4d6d] transition-colors" />
                    </div>
                    <h4 style={{ margin: "0 0 6px", color: "#fff", fontSize: "1rem", fontWeight: 600 }}>No media files yet</h4>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Click "Add Media" to upload images or link videos.</p>
                  </motion.div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {mediaItems.map((m, i) => (
                      <MediaBlock key={m.id || `new-${i}`} media={m} index={i} isFirst={i === 0} isLast={i === mediaItems.length - 1} onUpdate={nm => updateMedia(i, nm)} onRemove={() => removeMedia(i)} onMoveUp={() => swapMedia(i, i - 1)} onMoveDown={() => swapMedia(i, i + 1)} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Modal Footer */}
            <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-white/10 hover:text-white hover:border-white/20 flex-1 sm:flex-none">
                Cancel
              </motion.button>
              <motion.button type="submit" whileHover={!(createMutation.isPending || updateMutation.isPending) ? { scale: 1.02, boxShadow: "0 10px 30px rgba(195,20,61,0.5)" } : {}} whileTap={{ scale: 0.97 }} disabled={createMutation.isPending || updateMutation.isPending} style={{ background: "linear-gradient(135deg, #C3143D, #9b1031)", border: "none", borderRadius: 12, padding: "12px 32px", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 20px rgba(195,20,61,0.3)", flex: "1", minWidth: 0, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }} className="sm:flex-none">
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{mode === "create" ? "Create Masterpiece" : "Save Changes"}</span>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Gallery Viewer ───────────────────────────────────────────────────────────
function GalleryViewer({ portfolioId, onClose }: { portfolioId: string; onClose: () => void }) {
  const { data: response, isLoading } = usePortfolioDetails(portfolioId)
  const portfolio = response?.data

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 1000, maxHeight: "90vh", background: "#0a0a0a", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#fff", fontWeight: 600 }}>{portfolio?.captionEn || "Gallery"}</h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{portfolio?.captionAr}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </motion.button>
        </div>
        
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
              <Loader2 className="animate-spin" color="#C3143D" size={40} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>Loading high-res media...</span>
            </div>
          ) : !portfolio?.mediaItems?.length ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "rgba(255,255,255,0.3)" }}>
              No media items found.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {portfolio.mediaItems.map((media, i) => (
                <motion.div key={media.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} style={{ background: "#111", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)", position: "relative", aspectRatio: "1" }}>
                  {media.type === MediaType.Video ? (
                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                      <img src={media.coverImageUrl || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} onError={e => e.currentTarget.style.display = 'none'} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(195,20,61,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(195,20,61,0.4)" }}>
                          <Video size={20} color="#fff" />
                        </div>
                      </div>
                      <a href={media.mediaUrl || media.videoUrl} target="_blank" rel="noreferrer" style={{ position: "absolute", inset: 0 }} title="Play Video" />
                    </div>
                  ) : (
                    <a href={media.mediaUrl} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                      <img src={media.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} className="hover:scale-105" onError={e => e.currentTarget.style.display = 'none'} />
                    </a>
                  )}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
                    #{media.orderIndex}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Portfolio Manager ────────────────────────────────────────────────────
export function PortfolioManager() {
  const [pageIndex, setPageIndex] = useState(1)
  const [categoryId, setCategoryId] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: "create" | "edit"; id: string | null }>({ isOpen: false, mode: "create", id: null })
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewPortfolioId, setViewPortfolioId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data: catRes } = useCategories(1, 100)
  const categories = catRes?.data?.data || []
  const { data: response, isLoading } = usePortfolios(pageIndex, 10, categoryId === "all" ? undefined : categoryId)
  const portfolios = response?.data?.data || []
  const totalPages = response?.data?.totalPages || 1
  const hasNextPage = response?.data?.hasNextPage || false
  const hasPreviousPage = response?.data?.hasPreviousPage || false
  const deleteMutation = useDeletePortfolio()

  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type })
  const handleApiError = (error: any) => {
    const errorData = error?.data
    let msg = errorData?.title || errorData?.message || error.message || "Something went wrong"
    if (errorData?.errors) {
      if (Array.isArray(errorData.errors)) {
        if (errorData.errors.length > 0) msg = errorData.errors[0].message || errorData.errors[0].errorMessage || msg
      } else if (typeof errorData.errors === 'object') {
        msg = Object.values(errorData.errors).flat()[0] as string || msg
      }
    }
    showToast(msg, 'error')
  }

  const handleDelete = (id: string) => {
    setDeletingId(id); setConfirmDeleteId(null)
    deleteMutation.mutate(id, {
      onSuccess: () => { showToast("Item deleted successfully!"); setDeletingId(null) },
      onError: (err: any) => { handleApiError(err); setDeletingId(null) },
    })
  }

  const filtered = portfolios.filter(p =>
    p.captionEn.toLowerCase().includes(search.toLowerCase()) ||
    p.captionAr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: "1.7rem", fontWeight: 800, margin: 0, color: "#fff", letterSpacing: "-0.025em" }}>Portfolio</h1>
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }} style={{ fontSize: "0.72rem", fontWeight: 700, background: "rgba(195,20,61,0.12)", color: "#ff4d6d", border: "1px solid rgba(195,20,61,0.25)", borderRadius: 100, padding: "3px 10px" }}>
              {response?.data?.totalCount || 0} items
            </motion.span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.82rem", margin: "5px 0 0 0" }}>Manage and showcase your creative work</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(195,20,61,0.4)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModalState({ isOpen: true, mode: "create", id: null })}
          style={{ background: "linear-gradient(135deg, #C3143D, #8f0f2c)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 4px 16px rgba(195,20,61,0.3)", transition: "box-shadow 0.3s" }}
        >
          <Plus size={16} /> New Item
        </motion.button>
      </motion.div>

      {/* ── Controls ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.45, delay: 0.07, ease: [0.23, 1, 0.32, 1] }} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 340 }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: 14, height: 14, pointerEvents: "none" }} />
          <input
            type="text" placeholder="Search items…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="group hover:bg-white/[0.04]"
            style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px 10px 38px", color: "#fff", fontSize: "0.85rem", outline: "none", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxSizing: "border-box" }}
            onFocus={e => { e.currentTarget.style.borderColor = "#C3143D"; e.currentTarget.style.background = "rgba(195,20,61,0.03)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(195,20,61,0.15)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.boxShadow = "none" }}
          />
        </div>

        {/* Category Pills — horizontally scrollable */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, flex: "2 1 200px", paddingRight: 10 }} className="no-scrollbar">
          {[{ id: "all", nameEn: "All" }, ...categories].map((cat, ci) => {
            const active = categoryId === cat.id
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + ci * 0.04 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setCategoryId(cat.id); setPageIndex(1) }}
                className="relative"
                style={{
                  whiteSpace: "nowrap", padding: "8px 18px", borderRadius: 100, fontSize: "0.8rem", fontWeight: 700,
                  cursor: "pointer", border: "1px solid transparent",
                  background: "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  transition: "color 0.3s ease",
                  zIndex: 1,
                }}
              >
                {!active && (
                  <div className="absolute inset-0 bg-white/[0.03] border border-white/[0.07] rounded-full -z-10 hover:bg-white/[0.06] transition-colors" />
                )}
                {active && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-[#C3143D] rounded-full -z-10 shadow-[0_4px_16px_rgba(195,20,61,0.28)] border border-[#C3143D]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {cat.nameEn}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ── List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 2 }}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(255,255,255,0.015)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.04)" }}>
              <Loader2 className="animate-spin" color="#C3143D" size={30} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading portfolio…</span>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} style={{ padding: "52px 20px", textAlign: "center", background: "rgba(255,255,255,0.015)", borderRadius: 20, border: "1px dashed rgba(255,255,255,0.07)" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }} style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Film color="rgba(255,255,255,0.18)" size={22} />
              </motion.div>
              <h3 style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 600 }}>No items found</h3>
              <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>Try a different filter or add a new portfolio item.</p>
            </motion.div>
          ) : (
            <motion.div key="list" variants={staggerContainer} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  layout
                  style={{
                    background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 16, opacity: deletingId === item.id ? 0.45 : 1,
                    position: "relative", overflow: "hidden",
                  }}
                  className="group transition-all duration-500 hover:bg-white/[0.03] hover:border-[#C3143D]/30 hover:shadow-[0_4px_30px_rgba(195,20,61,0.08)] hover:-translate-y-[2px]"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Subtle Red glow accent on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700" style={{ background: "radial-gradient(circle at 10% 50%, rgba(195,20,61,0.05) 0%, transparent 60%)" }} />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5">

                    {/* Left: thumbnail + text */}
                    <div className="flex items-center gap-4 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.3 }}
                        style={{ width: 58, height: 58, borderRadius: 14, background: "#111", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, boxShadow: "0 6px 18px rgba(0,0,0,0.45)", position: "relative" }}
                      >
                        {item.thumbnailUrl && item.thumbnailUrl !== "null" && item.thumbnailUrl.trim() !== "" ? (
                          <img src={item.thumbnailUrl} alt={item.captionEn} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} className="group-hover:scale-110" onError={e => e.currentTarget.style.display = 'none'} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Film color="rgba(255,255,255,0.1)" size={20} />
                          </div>
                        )}
                        {item.thumbnailType === MediaType.Video && (
                          <div style={{ position: "absolute", bottom: 3, right: 3, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "2px 4px", display: "flex" }}>
                            <Video size={8} color="#fff" />
                          </div>
                        )}
                      </motion.div>

                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.captionEn}</h3>
                        <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} dir="rtl">{item.captionAr}</p>
                      </div>
                    </div>

                    {/* Right: badges + actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "4px 10px", whiteSpace: "nowrap" }}>
                          {item.categoryNameEn}
                        </span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px" }}>
                          #{item.orderIndex}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setViewPortfolioId(item.id)}
                          style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          className="hover:bg-[#C3143D] hover:text-white hover:border-transparent"
                          title="View Media"
                        >
                          <Eye size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setModalState({ isOpen: true, mode: "edit", id: item.id })}
                          style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          className="hover:bg-white/10 hover:text-white hover:border-white/20"
                        >
                          <Edit2 size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setConfirmDeleteId(item.id)}
                          disabled={deletingId === item.id}
                          style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", color: "#ef4444", cursor: deletingId === item.id ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                          className="hover:bg-red-500/20 hover:border-red-500/30"
                        >
                          {deletingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pagination ── */}
      <AnimatePresence>
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#0a0a0a", border: "1px solid rgba(195,20,61,0.2)", borderRadius: 100, padding: "4px 6px", boxShadow: "0 8px 32px rgba(195,20,61,0.1)" }}>
              {[
                { label: "Prev", icon: <ChevronLeft size={15} />, side: "left", active: hasPreviousPage, onClick: () => setPageIndex(p => Math.max(1, p - 1)) },
                { label: "Next", icon: <ChevronRight size={15} />, side: "right", active: hasNextPage, onClick: () => setPageIndex(p => Math.min(totalPages, p + 1)) },
              ].map((btn, bi) => (
                <motion.button key={bi} whileHover={btn.active ? { scale: 1.05 } : {}} whileTap={btn.active ? { scale: 0.95 } : {}} onClick={btn.onClick} disabled={!btn.active} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 100, background: btn.active ? "rgba(195,20,61,0.1)" : "transparent", color: btn.active ? "#ff4d6d" : "rgba(255,255,255,0.18)", cursor: btn.active ? "pointer" : "not-allowed", border: "none", fontSize: "0.83rem", fontWeight: 700, order: btn.side === "right" ? 2 : 0, transition: "all 0.25s" }} className={btn.active ? "hover:bg-[#C3143D] hover:text-white" : ""}>
                  {btn.side === "left" && btn.icon}
                  <span className="hidden sm:inline">{btn.label}</span>
                  {btn.side === "right" && btn.icon}
                </motion.button>
              ))}
              <div style={{ display: "flex", alignItems: "center", padding: "0 14px", color: "rgba(255,255,255,0.35)", fontSize: "0.83rem", order: 1 }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", textShadow: "0 0 10px rgba(195,20,61,0.5)" }}>{pageIndex}</span>
                <span style={{ margin: "0 5px", opacity: 0.4 }}>/</span>
                <span>{totalPages}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDeleteId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div variants={scaleIn} initial="hidden" animate="show" exit="hidden" onClick={e => e.stopPropagation()} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, width: "100%", maxWidth: 360, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 24px 70px rgba(0,0,0,0.65)" }}>
              <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 350, damping: 20 }} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Trash2 color="#ef4444" size={20} />
              </motion.div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#fff", fontWeight: 700 }}>Delete Item?</h2>
              <p style={{ margin: "8px 0 24px", fontSize: "0.84rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>This action cannot be undone and all associated media will be removed.</p>
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, color: "#fff", fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-white/5">Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(239,68,68,0.4)" }} whileTap={{ scale: 0.97 }} onClick={() => handleDelete(confirmDeleteId)} style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: 10, padding: 10, color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}>Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalState.isOpen && (
          <PortfolioModal
            isOpen={modalState.isOpen} mode={modalState.mode} id={modalState.id}
            onClose={() => setModalState({ ...modalState, isOpen: false })}
            showToast={(msg, type = "success") => setToast({ message: msg, type })}
          />
        )}
      </AnimatePresence>

      {/* Gallery Viewer */}
      <AnimatePresence>
        {viewPortfolioId && (
          <GalleryViewer portfolioId={viewPortfolioId} onClose={() => setViewPortfolioId(null)} />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
