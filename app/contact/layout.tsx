import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with REVO for your next concert, commercial production, or media campaign.",
  openGraph: {
    title: "Contact Us | REVO Media Production",
    description: "Get in touch with REVO for your next concert, commercial production, or media campaign.",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
