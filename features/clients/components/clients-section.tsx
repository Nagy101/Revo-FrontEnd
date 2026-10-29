"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// Real client portfolio from client assets
const TRACK_ONE_CLIENTS = [
  "SODIC",
  "CAIROKEE BAND",
  "AMER GROUP HOLDING",
  "DORRA",
  "MASSAR EGBARI",
  "REEDY GROUP",
  "CITY CLUB",
  "AZZAR LEGACY",
  "ZG",
]

const TRACK_TWO_CLIENTS = [
  "RAMY GAMAL",
  "MAKER FAIRE CAIRO",
  "REDA ELBAHRAWY",
  "SAN3ATECH",
  "UPWARD",
  "TEB SPACE",
  "RUSHUB",
  "ICON",
  "PR",
]

export function ClientsSection() {
  const { isArabic } = useLanguage()

  // Exactly two identical halves (2 x 2 sets) for a mathematically seamless 50% loop
  const singleHalfOne = [...TRACK_ONE_CLIENTS, ...TRACK_ONE_CLIENTS]
  const trackOneItems = [...singleHalfOne, ...singleHalfOne]

  const singleHalfTwo = [...TRACK_TWO_CLIENTS, ...TRACK_TWO_CLIENTS]
  const trackTwoItems = [...singleHalfTwo, ...singleHalfTwo]

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#050505] overflow-hidden flex flex-col items-center justify-center z-20 border-t border-white/5">
      
      {/* ── BACKGROUND AMBIENT GLOW ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(195,20,61,0.08),transparent)] pointer-events-none" />

      {/* ── SECTION HEADER ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mb-12 md:mb-16">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" />
          <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
            {isArabic ? "سجل عملائنا وشركاء النجاح" : "Our Customer Portfolio"}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-sora font-extrabold uppercase tracking-tight text-white">
          {isArabic ? (
            <>
              موثوق به من كبرى <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">العلامات والنجوم</span>
            </>
          ) : (
            <>
              Trusted by Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">Brands & Stars</span>
            </>
          )}
        </h2>
      </div>

      {/* ── CSS KEYFRAMES FOR ROCK-SOLID INFINITE MARQUEE ── */}
      <style>{`
        @keyframes revoMarqueeTrackLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes revoMarqueeTrackRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .revo-marquee-left {
          display: flex;
          width: max-content;
          animation: revoMarqueeTrackLeft 32s linear infinite;
          will-change: transform;
        }
        .revo-marquee-right {
          display: flex;
          width: max-content;
          animation: revoMarqueeTrackRight 35s linear infinite;
          will-change: transform;
        }
        .revo-marquee-left:hover,
        .revo-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── MARQUEE CONTAINER (DUAL RIBBON WITH EDGE FADES) ── */}
      <div className="relative w-full overflow-hidden flex flex-col gap-5 md:gap-6" dir="ltr">
        
        {/* Left & Right Edge Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-20 md:w-48 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 md:w-48 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent z-20 pointer-events-none" />

        {/* ── TRACK 1: SIGNATURE CRIMSON RIBBON (Left Scrolling) ── */}
        <div className="relative w-full py-4 md:py-5 bg-[#C3143D] border-y border-white/20 shadow-[0_10px_40px_rgba(195,20,61,0.35)] flex items-center overflow-hidden transform -rotate-1 md:-rotate-1 will-change-transform" dir="ltr">
          <div className="revo-marquee-left items-center gap-8 md:gap-14 select-none">
            {trackOneItems.map((name, index) => (
              <div key={`t1-${name}-${index}`} className="flex items-center gap-8 md:gap-14 shrink-0">
                <span className="text-white font-sora font-black uppercase tracking-[0.18em] text-base sm:text-xl md:text-2xl whitespace-nowrap hover:scale-105 transition-transform duration-300 drop-shadow-md">
                  {name}
                </span>
                <span className="text-white/60 text-lg md:text-2xl font-bold">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRACK 2: DARK LUXURY FROSTED RIBBON (Right Scrolling) ── */}
        <div className="relative w-full py-4 md:py-5 bg-black/60 md:bg-white/[0.03] md:backdrop-blur-xl border-y border-white/10 flex items-center overflow-hidden transform rotate-1 md:rotate-1 will-change-transform" dir="ltr">
          <div className="revo-marquee-right items-center gap-8 md:gap-14 select-none">
            {trackTwoItems.map((name, index) => (
              <div key={`t2-${name}-${index}`} className="flex items-center gap-8 md:gap-14 shrink-0">
                <span className="text-white/90 font-serif italic text-lg sm:text-2xl md:text-3xl whitespace-nowrap hover:text-white hover:scale-105 transition-all duration-300">
                  {name}
                </span>
                <span className="text-[#C3143D] text-lg md:text-2xl font-bold drop-shadow-[0_0_8px_rgba(195,20,61,0.8)]">✦</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM TRUST STATEMENT (FROM CLIENT ASSET) ── */}
      <div className="relative z-10 mt-12 md:mt-16 px-6 max-w-4xl mx-auto text-center">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C3143D] to-transparent mx-auto mb-4" />
        <p className="text-[11px] sm:text-xs md:text-sm font-light uppercase tracking-[0.25em] text-white/50 leading-relaxed drop-shadow">
          {isArabic
            ? "شراكتنا مع هذه المؤسسات والكيانات مبنية دائماً على ثقة راسخة"
            : "Our collaboration with these institutions has always been built on strong trust"}
        </p>
      </div>

    </section>
  )
}
