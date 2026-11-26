"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"

interface DeferredVimeoPlayerProps {
  videoId: string
  title: string
  thumbnailUrl?: string
  onClick?: () => void
  autoPlay?: boolean
}

type VideoPlatform = "youtube" | "vimeo" | "drive" | "instagram" | "direct"

function isLikelyImageUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return false
  const lower = url.toLowerCase()
  if (
    lower.includes("youtube.com/watch") ||
    lower.includes("youtube.com/shorts") ||
    lower.includes("youtu.be/") ||
    lower.includes("vimeo.com/") ||
    lower.includes("drive.google.com/") ||
    lower.includes("instagram.com/") ||
    /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(lower) ||
    lower.includes("/video/upload/")
  ) {
    return false
  }
  return true
}

function parseVideoSource(rawInput: string): {
  platform: VideoPlatform
  id: string
  hash?: string
  embedUrl: string
} {
  const input = (rawInput || "").trim()

  // 1. Direct video file or Cloudinary video upload
  if (
    /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(input) ||
    input.includes("/video/upload/") ||
    input.startsWith("/videos/") ||
    input.startsWith("blob:")
  ) {
    return { platform: "direct", id: input, embedUrl: input }
  }

  // 2. YouTube (watch, youtu.be, shorts, embed, live)
  if (input.includes("youtube.com") || input.includes("youtu.be") || input.includes("youtube-nocookie.com")) {
    let id = ""
    try {
      const url = new URL(input)
      if (url.hostname.includes("youtu.be")) {
        id = url.pathname.slice(1).split("/")[0].split("?")[0]
      } else if (url.pathname.includes("/shorts/")) {
        id = url.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0] || ""
      } else if (url.pathname.includes("/embed/")) {
        id = url.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0] || ""
      } else if (url.pathname.includes("/live/")) {
        id = url.pathname.split("/live/")[1]?.split("/")[0]?.split("?")[0] || ""
      } else {
        id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop() || ""
      }
    } catch {
      const match = input.match(/(?:shorts\/|embed\/|live\/|v=|youtu\.be\/)([\w-]{6,})/)
      if (match) id = match[1]
    }
    return {
      platform: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
    }
  }

  // 3. Google Drive
  if (input.includes("drive.google.com")) {
    const fileMatch = input.match(/\/file\/d\/([^/?]+)/)
    const idParamMatch = input.match(/[?&]id=([^&]+)/)
    const id = fileMatch?.[1] || idParamMatch?.[1] || ""
    return {
      platform: "drive",
      id,
      embedUrl: id ? `https://drive.google.com/file/d/${id}/preview` : input,
    }
  }

  // 4. Instagram Reel / Post / TV
  if (input.includes("instagram.com/")) {
    const igMatch = input.match(/instagram\.com\/(reel|reels|p|tv)\/([^/?#]+)/i)
    if (igMatch) {
      const kind = igMatch[1].toLowerCase() === "reels" ? "reel" : igMatch[1].toLowerCase()
      const code = igMatch[2]
      return {
        platform: "instagram",
        id: code,
        embedUrl: `https://www.instagram.com/${kind}/${code}/embed`,
      }
    }
  }

  // 5. Vimeo (supports vimeo.com/ID, vimeo.com/ID/HASH, player.vimeo.com/video/ID?h=HASH, or plain numeric ID)
  if (input.includes("vimeo.com") || /^\d+$/.test(input)) {
    let id = input
    let hash: string | undefined
    if (input.includes("vimeo.com")) {
      try {
        const url = new URL(input)
        const hParam = url.searchParams.get("h")
        if (hParam) hash = hParam
        const segments = url.pathname
          .split("/")
          .filter(Boolean)
          .filter((s) => s !== "video" && s !== "manage" && s !== "videos" && s !== "channels")
        const numericIndex = segments.findIndex((s) => /^\d+$/.test(s))
        if (numericIndex !== -1) {
          id = segments[numericIndex]
          if (!hash && segments[numericIndex + 1]) {
            hash = segments[numericIndex + 1]
          }
        }
      } catch {
        const vMatch = input.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\w-]+))?/)
        if (vMatch) {
          id = vMatch[1]
          hash = vMatch[2]
        }
      }
    }
    return {
      platform: "vimeo",
      id,
      hash,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ""}`,
    }
  }

  // Fallback: direct video attempt
  return { platform: "direct", id: input, embedUrl: input }
}

export function DeferredVimeoPlayer({
  videoId,
  title,
  thumbnailUrl,
  onClick,
  autoPlay = false,
}: DeferredVimeoPlayerProps) {
  const initialCleanThumb = isLikelyImageUrl(thumbnailUrl) ? thumbnailUrl : undefined
  const [isLoaded, setIsLoaded] = useState(autoPlay)
  const [thumbnail, setThumbnail] = useState<string | undefined>(initialCleanThumb)

  const parsed = parseVideoSource(videoId)

  useEffect(() => {
    setThumbnail(isLikelyImageUrl(thumbnailUrl) ? thumbnailUrl : undefined)
  }, [thumbnailUrl])

  useEffect(() => {
    if (!thumbnail && parsed.id) {
      if (parsed.platform === "youtube") {
        setThumbnail(`https://img.youtube.com/vi/${parsed.id}/maxresdefault.jpg`)
      } else if (parsed.platform === "vimeo") {
        const vimeoTarget = parsed.hash
          ? `https://vimeo.com/${parsed.id}/${parsed.hash}`
          : `https://vimeo.com/${parsed.id}`
        fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoTarget)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.thumbnail_url) {
              setThumbnail(data.thumbnail_url)
            }
          })
          .catch(() => {})
      }
    }
  }, [parsed.id, parsed.platform, parsed.hash, thumbnail])

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden">
      {!isLoaded ? (
        <button
          type="button"
          onClick={() => {
            if (onClick) {
              onClick()
            } else {
              setIsLoaded(true)
            }
          }}
          className="absolute inset-0 w-full h-full bg-black cursor-pointer focus:outline-none flex items-center justify-center"
          aria-label={`Play ${title}`}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-contain bg-black opacity-85 group-hover:opacity-70 transition-opacity duration-300"
              onError={() => {
                if (parsed.platform === "youtube" && thumbnail.includes("maxresdefault")) {
                  setThumbnail(`https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`)
                } else {
                  setThumbnail(undefined)
                }
              }}
            />
          ) : (
            /* Pure black space is the default when no cover image is set */
            <div className="w-full h-full bg-black" />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C3143D] rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(195,20,61,0.55)]">
              <Play size={28} className="ml-1 fill-current" />
            </div>
          </div>
        </button>
      ) : parsed.platform === "direct" ? (
        <video
          src={parsed.embedUrl}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="w-full h-full object-contain bg-black"
        />
      ) : (
        <iframe
          src={parsed.embedUrl}
          className="absolute inset-0 w-full h-full bg-black border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  )
}
