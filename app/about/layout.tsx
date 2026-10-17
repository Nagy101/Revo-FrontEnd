import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about REVO's visionary creative directors, cinematographers, and world-class concert production team.",
  openGraph: {
    title: "About Us | REVO Media Production",
    description: "Learn about REVO's visionary creative directors, cinematographers, and world-class concert production team.",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
