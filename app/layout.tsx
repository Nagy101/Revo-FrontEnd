import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

export const metadata: Metadata = {
  title: "REVO - Creative Digital Agency",
  description:
    "Transform your brand with cutting-edge digital solutions. We create stunning websites, powerful applications, and memorable experiences.",
  keywords: "digital agency, web design, mobile apps, branding, digital marketing",
  authors: [{ name: "REVO Agency" }],
  creator: "REVO Agency",
  publisher: "REVO Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://revoagency.com",
    title: "REVO - Creative Digital Agency",
    description: "Transform your brand with cutting-edge digital solutions.",
    siteName: "REVO Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "REVO - Creative Digital Agency",
    description: "Transform your brand with cutting-edge digital solutions.",
    creator: "@revoagency",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="font-inter antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
