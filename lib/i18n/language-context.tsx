"use client"

import React, { createContext, useContext, useEffect } from "react"
import { translations, TranslationKey } from "./translations"

type Locale = "en"

interface LanguageContextType {
  locale: Locale
  dir: "ltr"
  isArabic: false
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
  localize: (enValue?: string | null, arValue?: string | null) => string
}

const defaultContextValue: LanguageContextType = {
  locale: "en",
  dir: "ltr",
  isArabic: false,
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key: TranslationKey) => translations.en[key] || key,
  localize: (enValue?: string | null, arValue?: string | null) => enValue || arValue || "",
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      localStorage.removeItem("revo-lang")
    } catch {}
    document.documentElement.lang = "en"
    document.documentElement.dir = "ltr"
  }, [])

  return (
    <LanguageContext.Provider value={defaultContextValue}>
      <div dir="ltr" className="font-sans antialiased">
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
