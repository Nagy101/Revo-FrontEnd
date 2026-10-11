import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "REVO - Creative Media Production",
  description:
    "We create bold visual experiences, stadium concert productions, and cinematic commercial films that captivate audiences.",
  keywords: "media production, filmmaking, concert coverage, commercial films, visual storytelling, REVO",
  authors: [{ name: "REVO Media Production" }],
  creator: "REVO Media Production",
  publisher: "REVO Media Production",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/revo-icon.png", type: "image/png" },
    ],
    apple: "/images/revo-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://revoagency.com",
    title: "REVO - Creative Media Production",
    description: "Bold visual experiences, concert productions, and cinematic commercial films.",
    siteName: "REVO Media Production",
  },
  twitter: {
    card: "summary_large_image",
    title: "REVO - Creative Media Production",
    description: "Bold visual experiences, concert productions, and cinematic commercial films.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden selection:bg-[#C3143D] selection:text-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Sora:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter antialiased overflow-x-hidden selection:bg-[#C3143D] selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
