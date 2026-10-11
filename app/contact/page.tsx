"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  User, 
  MessageSquare,
  ArrowRight
} from "lucide-react"
import { useCreateContactRequest } from "@/features/contact/hooks/useContactRequests"
import { useServices } from "@/features/services/hooks/useServices"
import { useLanguage } from "@/lib/i18n/language-context"

const EASE = [0.16, 1, 0.3, 1] as const

const FALLBACK_SERVICE_PILLS = [
  { id: "concerts", nameEn: "Live Concerts", nameAr: "حفلات استادات ومهرجانات" },
  { id: "production", nameEn: "Media Production", nameAr: "إنتاج إعلامي وسينمائي" },
  { id: "commercial", nameEn: "Commercial Films", nameAr: "إعلانات تجارية" },
  { id: "branding", nameEn: "Branding & Identity", nameAr: "هوية بصرية وتصميم" },
  { id: "general", nameEn: "General Inquiry", nameAr: "استفسار عام" },
]

const TRUSTED_CLIENTS = [
  "SODIC",
  "CAIROKEE",
  "AMER GROUP",
  "MASSAR EGBARI",
  "DORRA",
  "RAMY GAMAL",
  "REDA ELBAHRAWY",
  "CITY CLUB",
  "REEDY GROUP",
]

export default function ContactPage() {
  const { isArabic } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    serviceId: "",
    message: "",
  })
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // API Hooks
  const { mutate: submitContact, isPending } = useCreateContactRequest()
  const { data: servicesData } = useServices(1, 50)
  const services = servicesData?.data?.data && servicesData.data.data.length > 0
    ? servicesData.data.data.map(s => ({
        id: s.id,
        name: isArabic ? (s.nameAr || s.nameEn) : (s.nameEn || s.nameAr)
      }))
    : FALLBACK_SERVICE_PILLS.map(s => ({
        id: s.id,
        name: isArabic ? s.nameAr : s.nameEn
      }))

  useEffect(() => {
    setIsMounted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Mouse spotlight tracking
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phoneNumber.trim()) return

    submitContact(
      {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        message: formData.message.trim() || "Inquiry submitted via REVO Contact Portal",
        serviceId: formData.serviceId || undefined,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true)
          setFormData({ name: "", phoneNumber: "", serviceId: "", message: "" })
        },
      }
    )
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#C3143D] selection:text-white pb-32 overflow-hidden">
      {/* ── CINEMATIC STADIUM FIREWORKS HERO BACKDROP ── */}
      <div className="absolute top-0 left-0 right-0 h-[800px] overflow-hidden pointer-events-none z-0">
        <img
          src="/images/revo-hero-bg.jpg"
          alt="REVO Production Atmosphere"
          className="w-full h-full object-cover object-bottom opacity-75"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/60 to-[#050505]" />
      </div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
          className="fixed w-[900px] h-[900px] bg-[#C3143D]/12 rounded-full blur-[240px] pointer-events-none z-0"
        />
      )}

      {/* ── NOISE OVERLAY ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'url("/images/noise.png")' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 sm:pt-40">
        {/* ── HEADER TITLE & LEAD ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14 text-center max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
            <Flame className="w-3.5 h-3.5 text-[#C3143D]" />
            <span className="text-[#C3143D] text-[11px] font-sora font-bold tracking-[0.28em] uppercase">
              {isArabic ? "ابدأ مشروعك الآن" : "Initiate Production"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sora font-black uppercase text-white tracking-tight leading-[1.08] mb-5 drop-shadow-2xl">
            {isArabic ? (
              <>
                يلا نصنع مع بعض حاجة{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">
                  تاريخية.
                </span>
              </>
            ) : (
              <>
                Let&apos;s Create Something{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">
                  Iconic.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl">
            {isArabic
              ? "عندك مشروع يستحق يشد أنظار العالم؟ من أضخم حفلات الاستادات للحملات الإعلانية العالمية، REVO بتحول أفكارك لواقع مبهر."
              : "Have a project that demands global attention? From stadium concerts to high-end commercial campaigns, REVO brings ideas to life."}
          </p>
        </motion.div>

        {/* ── MAIN STAGE: COMMAND CENTER GRID (7 COLS / 5 COLS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT COLUMN: PRODUCTION BRIEF FORM (7 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl md:rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#111111]/90 to-[#090909]/95 backdrop-blur-2xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(195,20,61,0.08)] overflow-hidden">
              {/* Subtle top accent hairline */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C3143D] to-transparent" />

              {isSubmitted ? (
                /* Success Confirmation View */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#C3143D]/10 border border-[#C3143D]/40 flex items-center justify-center text-[#C3143D] mb-5 shadow-[0_0_30px_rgba(195,20,61,0.3)] animate-pulse">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-sora font-extrabold text-white uppercase tracking-tight mb-2">
                    {isArabic ? "تم استلام تفاصيل المشروع بنجاح" : "Production Brief Received"}
                  </h3>
                  <p className="text-white/60 text-sm max-w-md leading-relaxed mb-8">
                    {isArabic
                      ? "شكراً لك! سيقوم المنتج الإبداعي بمراجعة متطلباتك والتواصل معك خلال 24 ساعة."
                      : "Thank you! Our executive producer will review your requirements and reach out within 24 hours."}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-[#C3143D] text-white text-xs font-sora font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    {isArabic ? "إرسال طلب مشروع آخر" : "Submit Another Brief"}
                  </button>
                </div>
              ) : (
                /* Production Brief Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Title & Instruction */}
                  <div className="pb-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-sora font-bold uppercase tracking-[0.25em] text-[#C3143D] block mb-1">
                        {isArabic ? "طلب واستفسار مباشر" : "Direct Inquiry"}
                      </span>
                      <h3 className="text-lg font-sora font-extrabold text-white tracking-tight">
                        {isArabic ? "كلمنا عن رؤيتك وفكرتك" : "Tell Us About Your Vision"}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                      {isArabic ? "رد خلال 24 ساعة" : "24h Response"}
                    </span>
                  </div>

                  {/* Interactive Service Pills */}
                  <div>
                    <label className="text-xs font-sora font-semibold text-white/60 uppercase tracking-wider block mb-3">
                      {isArabic ? "اختر نوع الخدمة / التخصص" : "Select Discipline / Service"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const isSelected = formData.serviceId === s.id
                        return (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                serviceId: isSelected ? "" : s.id,
                              })
                            }
                            className={`px-3.5 py-1.5 rounded-full text-xs font-sora tracking-wide transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "bg-[#C3143D] text-white font-bold shadow-[0_0_15px_rgba(195,20,61,0.5)] border border-[#C3143D]"
                                : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07] border border-white/10"
                            }`}
                          >
                            {s.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Full Name & Phone Number (Side-by-Side on Desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="text-xs font-sora font-semibold text-white/60 uppercase tracking-wider block mb-2">
                        {isArabic ? "الاسم بالكامل / المؤسسة *" : "Full Name *"}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isArabic ? "اسمك الكريم أو اسم شركتك" : "Your Name / Organization"}
                          className="w-full bg-[#050505]/80 border border-white/10 focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] rounded-xl h-12 pl-11 pr-4 rtl:pl-4 rtl:pr-11 text-xs sm:text-sm text-white placeholder:text-white/25 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Number / WhatsApp */}
                    <div>
                      <label htmlFor="phoneNumber" className="text-xs font-sora font-semibold text-white/60 uppercase tracking-wider block mb-2">
                        {isArabic ? "رقم الهاتف / واتساب *" : "Phone / WhatsApp *"}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                        <input
                          id="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="+20 100 000 0000"
                          className="w-full bg-[#050505]/80 border border-white/10 focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] rounded-xl h-12 pl-11 pr-4 rtl:pl-4 rtl:pr-11 text-xs sm:text-sm text-white placeholder:text-white/25 outline-none transition-all font-mono text-left dir-ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details Message */}
                  <div>
                    <label htmlFor="message" className="text-xs font-sora font-semibold text-white/60 uppercase tracking-wider block mb-2">
                      {isArabic ? "نطاق المشروع والأهداف *" : "Project Scope & Goals *"}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 rtl:left-auto rtl:right-4 top-3.5 text-white/35" size={16} />
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isArabic
                            ? "كلمنا عن تفاصيل الحدث، الحملة الإعلانية، الجدول الزمني، والرؤية الإبداعية..."
                            : "Tell us about your event, brand campaign, timeline, and creative vision..."
                        }
                        className="w-full bg-[#050505]/80 border border-white/10 focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] rounded-xl pt-3 pl-11 pr-4 rtl:pl-4 rtl:pr-11 text-xs sm:text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* ── ELEVATED LUXURY SUBMIT BUTTON ── */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full h-14 rounded-2xl overflow-hidden bg-gradient-to-r from-[#C3143D] via-[#a81033] to-[#800a26] text-white font-sora font-extrabold uppercase tracking-[0.2em] text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(195,20,61,0.4)] hover:shadow-[0_15px_45px_rgba(195,20,61,0.65)] hover:scale-[1.01] active:scale-[0.99] border-t border-white/25 disabled:opacity-60 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        <span>{isArabic ? "جاري الإرسال..." : "Transmitting Brief..."}</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">
                          {isArabic ? "إرسال تفاصيل المشروع" : "Transmit Production Brief"}
                        </span>
                        <Send size={15} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-0.5 rtl:rotate-180 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: STUDIO HEADQUARTERS & DIRECT CHANNELS (5 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Card 1: Direct Hotline */}
            <div className="p-6 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C3143D]/10 border border-[#C3143D]/30 flex items-center justify-center text-[#C3143D] shrink-0 group-hover:scale-105 transition-transform">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-sora font-bold uppercase tracking-[0.2em] text-[#C3143D] block mb-1">
                    {isArabic ? "الخط المباشر وواتساب" : "Direct Line & WhatsApp"}
                  </span>
                  <a
                    href="tel:+201000000000"
                    className="text-base sm:text-lg font-sora font-bold text-white hover:text-[#C3143D] transition-colors block font-mono dir-ltr text-left"
                  >
                    +20 100 000 0000
                  </a>
                  <p className="text-white/40 text-xs mt-1">
                    {isArabic
                      ? "متاح للحجوزات الفورية وجداول إنتاج الحفلات والاستادات العاجلة."
                      : "Available for urgent stadium & live production scheduling."}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Executive Office Email */}
            <div className="p-6 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C3143D]/10 border border-[#C3143D]/30 flex items-center justify-center text-[#C3143D] shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-sora font-bold uppercase tracking-[0.2em] text-[#C3143D] block mb-1">
                    {isArabic ? "المراسلات الرسمية" : "Executive Briefings"}
                  </span>
                  <a
                    href="mailto:hello@revo.com"
                    className="text-base sm:text-lg font-sora font-bold text-white hover:text-[#C3143D] transition-colors block"
                  >
                    hello@revo.com
                  </a>
                  <p className="text-white/40 text-xs mt-1">
                    {isArabic
                      ? "للعروض الرسمية، مناقصات الوكالات، واستدراج العروض (RFPs)."
                      : "For agency pitches, official RFPs, and formal briefs."}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Studio Location */}
            <div className="p-6 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/10 hover:border-[#C3143D]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C3143D]/10 border border-[#C3143D]/30 flex items-center justify-center text-[#C3143D] shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-sora font-bold uppercase tracking-[0.2em] text-[#C3143D] block mb-1">
                    {isArabic ? "المقر الرئيسي للاستوديو" : "Studio Headquarters"}
                  </span>
                  <span className="text-base sm:text-lg font-sora font-bold text-white block">
                    {isArabic ? "القاهرة، مصر" : "Cairo, Egypt"}
                  </span>
                  <p className="text-white/40 text-xs mt-1">
                    {isArabic
                      ? "إمكانيات إنتاج عالمية — نعمل في جميع أنحاء الشرق الأوسط والعالم."
                      : "Global production capabilities — operating across the Middle East & Worldwide."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quality & Trust Badges Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-white/[0.02] to-white/[0.04] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-xs text-white/70">
                <ShieldCheck size={15} className="text-[#C3143D] shrink-0" />
                <span>{isArabic ? "ضمان السرية التامة واتفاقيات عدم الإفصاح (NDA)" : "NDA & Client Confidentiality Guaranteed"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/70">
                <Clock size={15} className="text-[#C3143D] shrink-0" />
                <span>{isArabic ? "دراسة جدوى الإنتاج والرد خلال 24 ساعة" : "24-Hour Production Feasibility Feedback"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/70">
                <Sparkles size={15} className="text-[#C3143D] shrink-0" />
                <span>{isArabic ? "تواصل مباشر مع كبار المخرجين الإبداعيين" : "Direct Access to Senior Creative Directors"}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SIMPLE SLEEK TRUST RIBBON ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-sora font-semibold tracking-[0.25em] uppercase text-white/50 mb-6">
            <Sparkles size={12} className="text-[#C3143D]" />
            <span>{isArabic ? "موثوق به من كبار الفنانين والعلامات التجارية" : "Trusted By Leading Artists & Brands"}</span>
          </div>

          {/* Clean infinite marquee ribbon */}
          <div className="relative w-full overflow-hidden py-4" dir="ltr">
            {/* Edge fade gradients */}
            <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex items-center w-max gap-8 sm:gap-14 select-none will-change-transform"
            >
              {[...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS].map((client, idx) => (
                <div key={idx} className="flex items-center gap-8 sm:gap-14">
                  <span className="text-white/40 hover:text-white font-sora font-extrabold uppercase text-sm sm:text-lg tracking-[0.2em] transition-colors whitespace-nowrap">
                    {client}
                  </span>
                  <span className="text-[#C3143D]/60 text-xs sm:text-sm">✦</span>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-white/30 text-[11px] font-mono tracking-wider uppercase mt-6">
            {isArabic
              ? "القاهرة · دبي · الرياض · إنتاج وتصوير عالمي"
              : "Cairo · Dubai · Riyadh · Global Production Deployments"}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
