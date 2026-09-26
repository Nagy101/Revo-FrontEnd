import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

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
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Sora:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
