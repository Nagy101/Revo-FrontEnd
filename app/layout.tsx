import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://revoagency.com"),
  title: {
    default: "REVO - Creative Media Production",
    template: "%s | REVO",
  },
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
    images: [
      {
        url: "/images/revo-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "REVO Media Production",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REVO - Creative Media Production",
    description: "Bold visual experiences, concert productions, and cinematic commercial films.",
    creator: "@revomedia.eg",
    images: ["/images/revo-hero-bg.jpg"],
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} overflow-x-hidden selection:bg-[#C3143D] selection:text-white`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!sessionStorage.getItem('revo_splash_shown') && !window.location.pathname.startsWith('/admin')) {
                  document.documentElement.classList.add('splash-pending');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-inter antialiased overflow-x-hidden selection:bg-[#C3143D] selection:text-white bg-[#050505]">
        {/* Instant SSR Splash Shell: displayed immediately by browser engine before React hydrates */}
        <div id="revo-initial-splash" aria-hidden="true">
          <div className="revo-splash-aura" />
          <Image
            src="/images/revo-logo.png"
            alt="REVO"
            className="revo-splash-logo"
            width={160}
            height={80}
            priority
          />
          <div className="revo-splash-tagline">
            <span className="revo-splash-line" />
            <span className="revo-splash-text">Creative Media Production</span>
            <span className="revo-splash-line" />
          </div>
        </div>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
