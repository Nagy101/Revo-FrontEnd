"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { toggleLocale, isArabic } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`group relative flex items-center gap-1.5 h-7 sm:h-8 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#C3143D]/50 text-white/80 hover:text-white transition-all duration-300 cursor-pointer select-none backdrop-blur-md shadow-sm ${className}`}
      aria-label="Toggle language"
      title={isArabic ? "Switch to English" : "التحويل للغة العربية"}
    >
      <Globe className="w-3.5 h-3.5 text-[#C3143D] group-hover:rotate-45 transition-transform duration-300" />
      <span className="text-[11px] font-semibold tracking-wider">
        {isArabic ? "EN" : "عربي"}
      </span>
    </button>
  )
}
