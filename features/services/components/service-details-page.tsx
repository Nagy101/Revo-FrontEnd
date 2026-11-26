"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Loader2,
  Layers,
  Sparkles,
  Clock,
  Video,
  Sliders,
  ShieldCheck,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { useServiceDetails } from "../hooks/useServices"
import { useCreateContactRequest } from "@/features/contact/hooks/useContactRequests"

const EASE = [0.16, 1, 0.3, 1] as const

function getCleanImage(url: string | null | undefined): string {
  if (!url || url.includes("placehold.co") || url.trim() === "") {
    return "/images/revo-services-card1.jpg"
  }
  return url
}

interface ServiceDetailsPageProps {
  id: string
}

export function ServiceDetailsPage({ id }: ServiceDetailsPageProps) {
  const { data, isLoading, error } = useServiceDetails(id)
  const { mutate: submitBooking, isPending } = useCreateContactRequest()
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState("")

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    message: ""
  })

  useEffect(() => {
    setIsMounted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Mouse Spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const service = data?.data
  const title = (service?.nameEn || service?.nameAr || "Production Service").trim()
  const description = (service?.descriptionEn || service?.descriptionAr || "Full-spectrum media production engineered for unforgettable impact.").trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    let cleanPhone = formData.phoneNumber.trim().replace(/[\s-]/g, "")
    if (cleanPhone.startsWith("+20")) cleanPhone = cleanPhone.slice(2)
    else if (cleanPhone.startsWith("0020")) cleanPhone = cleanPhone.slice(3)
    else if (cleanPhone.startsWith("+2")) cleanPhone = cleanPhone.slice(2)

    if (!/^\d{11}$/.test(cleanPhone)) {
      setPhoneError("Phone number must be exactly 11 digits (e.g. 010xxxxxxxx).")
      return
    }
    setPhoneError("")

    const waText = `Hello REVO Media Production 👋\nI would like to inquire about booking: *${title}*\n\n👤 *Name:* ${formData.name.trim()}\n📱 *Phone:* ${cleanPhone}${formData.message.trim() ? `\n📝 *Message:* \n${formData.message.trim()}` : ""}`

    const whatsappUrl = `https://wa.me/201064102972?text=${encodeURIComponent(waText)}`
    setLastWhatsAppUrl(whatsappUrl)

    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    } catch (err) {
      console.error(err)
    }

    submitBooking(
      {
        serviceId: service.id,
        name: formData.name.trim(),
        phoneNumber: cleanPhone,
        message: formData.message.trim() || `Inquiry for ${service.nameEn}`
      },
      {
        onSuccess: () => {
          setIsSubmitted(true)
          setFormData({ name: "", phoneNumber: "", message: "" })
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="relative w-12 h-12 flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-[#C3143D] rounded-full animate-spin" />
          <Sparkles className="w-4 h-4 text-[#C3143D] absolute" />
        </div>
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-semibold">
          Loading Service Specs...
        </p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#C3143D]">
          <Layers size={24} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-sora font-extrabold mb-3">
          Service Not Found
        </h1>
        <p className="text-white/50 text-sm max-w-md mb-8 leading-relaxed">
          The requested service could not be found or has been moved.
        </p>
        <Link
          href="/services"
          className="px-6 py-3 rounded-full bg-[#C3143D] hover:bg-white hover:text-black text-white font-semibold uppercase tracking-wider text-xs transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back To All Services
        </Link>
      </div>
    )
  }

  const displayImage = getCleanImage(service.imageUrl)

  return (
    <div className="relative bg-[#050505] min-h-screen selection:bg-[#C3143D] selection:text-white pb-28 overflow-x-hidden">
      {/* ── CINEMATIC AMBIENT BACKDROP ── */}
      <div className="absolute top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-none z-0">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover opacity-15 filter blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]" />
      </div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
          className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[220px] pointer-events-none z-0"
        />
      )}

      {/* ── TOP BREADCRUMB ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 sm:pt-32 pb-4 flex items-center justify-between border-b border-white/5">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>All Services</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold uppercase tracking-widest text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D] animate-pulse" />
          REVO Production
        </div>
      </div>

      {/* ── HEADER TITLE & LEAD ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C3143D]/10 border border-[#C3143D]/30 text-[#C3143D] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles size={11} />
            Capability Specs
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold uppercase text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {title}
          </h1>

          <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-2xl whitespace-pre-line">
            {description}
          </p>
        </motion.div>
      </div>

      {/* ── MAIN STAGE: CINEMA SHOWCASE & LUXURY BOOKING SUITE SIDE-BY-SIDE ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT: CINEMA IMAGE SHOWCASE (16:10) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-[#0c0c0c] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group"
            >
              <img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Bottom Subtle Label */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                <span className="text-xs font-bold tracking-wider text-white/90 uppercase">
                  {title}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  Cinema 4K / 8K RAW
                </span>
              </div>
            </motion.div>

            {/* Clean Feature Line */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/70">
              <div className="flex items-center justify-center gap-1.5">
                <Video size={13} className="text-[#C3143D]" />
                <span>Dedicated Crew</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 border-x border-white/5">
                <Sliders size={13} className="text-[#C3143D]" />
                <span>Broadcast Spec</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-[#C3143D]" />
                <span>Fast Turnaround</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: LUXURY AESTHETIC BOOKING CARD ── */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#121212]/95 to-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(195,20,61,0.1)] overflow-hidden"
            >
              {/* Subtle top accent hairline */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C3143D]/70 to-transparent" />

              {/* Clean Card Header */}
              <div className="mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C3143D]">
                    Direct Booking
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                    24h Response
                  </span>
                </div>
                <h3 className="text-xl font-sora font-extrabold text-white tracking-tight">
                  Book This Service
                </h3>
                <p className="text-white/45 text-xs mt-1 font-light leading-relaxed">
                  Reserve production dates for <span className="text-white font-medium">{title}</span>.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#C3143D]/10 border border-[#C3143D]/40 flex items-center justify-center text-[#C3143D] mb-3 shadow-[0_0_20px_rgba(195,20,61,0.25)]">
                    <CheckCircle2 size={26} />
                  </div>
                  <h4 className="text-base font-sora font-bold text-white mb-1.5">
                    Request Received!
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed mb-6 font-light max-w-xs">
                    Thank you. Our creative team will review your project details and contact you within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <a
                      href={lastWhatsAppUrl || "https://wa.me/201064102972"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Hossam Shaaban"
                      className="w-full h-11 rounded-xl bg-black/50 border border-white/10 hover:border-white/20 px-4 text-xs sm:text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, phoneNumber: e.target.value })
                        if (phoneError) setPhoneError("")
                      }}
                      placeholder="010xxxxxxxx"
                      className={`w-full h-11 rounded-xl bg-black/50 border ${phoneError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-white/10 hover:border-white/20 focus:border-[#C3143D] focus:ring-[#C3143D]"} px-4 text-xs sm:text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 transition-all text-left dir-ltr`}
                    />
                    {phoneError && (
                      <p className="text-red-400 text-[11px] font-medium">{phoneError}</p>
                    )}
                  </div>

                  {/* Project Scope Textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-white/60 flex items-center justify-between">
                      <span>Project Details</span>
                      <span className="text-white/30 text-[10px] normal-case">Optional</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Event date, project scope, or ideas..."
                      className="w-full rounded-xl bg-black/50 border border-white/10 hover:border-white/20 p-3.5 text-xs sm:text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all resize-none"
                    />
                  </div>

                  {/* Aesthetic Submit Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 mt-1.5 rounded-full bg-[#C3143D] hover:bg-white hover:text-black text-white font-bold tracking-widest uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(195,20,61,0.35)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Minimal Contact Strip */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[#C3143D]" />
                  24h Response
                </span>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Let&apos;s Talk →
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
