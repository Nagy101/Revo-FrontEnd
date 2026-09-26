"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"

interface DeferredVimeoPlayerProps {
  videoId: string
  title: string
  thumbnailUrl?: string
  onClick?: () => void
}

export function DeferredVimeoPlayer({ videoId, title, thumbnailUrl, onClick }: DeferredVimeoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [thumbnail, setThumbnail] = useState(thumbnailUrl)

  // Parse video platform and ID
  let platform = 'vimeo'
  let id = videoId
  
  if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
    platform = 'youtube'
    try {
      const url = new URL(videoId)
      if (videoId.includes('youtu.be')) {
        id = url.pathname.slice(1).split('?')[0]
      } else {
        id = url.searchParams.get('v') || ''
      }
    } catch {
      // fallback if URL parsing fails
    }
  } else if (videoId.includes('vimeo.com')) {
    const parts = videoId.split('/')
    id = parts[parts.length - 1].split('?')[0]
  }

  useEffect(() => {
    if (!thumbnail && id) {
      if (platform === 'youtube') {
        // High quality youtube thumbnail
        setThumbnail(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
      } else {
        // Vimeo oEmbed
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`)
          .then(res => res.json())
          .then(data => {
            if (data.thumbnail_url) {
              setThumbnail(data.thumbnail_url)
            }
          })
          .catch(err => console.error("Failed to fetch Vimeo thumbnail", err))
      }
    }
  }, [id, platform, thumbnail])

  const iframeSrc = platform === 'youtube'
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`

  return (
    <div className="relative w-full h-full bg-[#111] flex items-center justify-center group overflow-hidden">
      {!isLoaded ? (
        <button
          onClick={() => {
            if (onClick) {
              onClick()
            } else {
              setIsLoaded(true)
            }
          }}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
          aria-label={`Play ${title}`}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
              onError={(e) => {
                // Fallback for youtube if maxresdefault doesn't exist
                if (platform === 'youtube' && thumbnail.includes('maxresdefault')) {
                  setThumbnail(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#111]">
              <div className="w-10 h-10 border-2 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#C3143D] rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(195,20,61,0.5)]">
              <Play size={32} className="ml-2" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  )
}
