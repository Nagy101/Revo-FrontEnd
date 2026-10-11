"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, TranslationKey } from "./translations"

type Locale = "en" | "ar"

interface LanguageContextType {
  locale: Locale
  dir: "ltr" | "rtl"
  isArabic: boolean
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
  localize: (enValue?: string | null, arValue?: string | null) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem("revo-lang") as Locale
    if (saved === "ar" || saved === "en") {
      setLocaleState(saved)
      applyHtmlAttributes(saved)
    } else {
      applyHtmlAttributes("en")
    }
  }, [])

  const applyHtmlAttributes = (lang: Locale) => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("revo-lang", newLocale)
    applyHtmlAttributes(newLocale)
  }

  const toggleLocale = () => {
    const next = locale === "en" ? "ar" : "en"
    setLocale(next)
  }

  const t = (key: TranslationKey): string => {
    const dict = translations[locale] || translations.en
    return dict[key] || translations.en[key] || key
  }

  const localize = (enValue?: string | null, arValue?: string | null): string => {
    if (locale === "ar") {
      return arValue || enValue || ""
    }
    return enValue || arValue || ""
  }

  const dir = locale === "ar" ? "rtl" : "ltr"
  const isArabic = locale === "ar"

  return (
    <LanguageContext.Provider
      value={{
        locale,
        dir,
        isArabic,
        setLocale,
        toggleLocale,
        t,
        localize,
      }}
    >
      <div dir={dir} className={isArabic ? "font-sans antialiased text-arabic-support" : "font-sans antialiased"}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: "en" as Locale,
      dir: "ltr" as const,
      isArabic: false,
      setLocale: () => {},
      toggleLocale: () => {},
      t: (k: TranslationKey) => translations.en[k] || k,
      localize: (en?: string | null, ar?: string | null) => en || ar || "",
    }
  }
  return context
}
