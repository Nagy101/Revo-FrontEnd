"use client"

import { useState, useRef, useEffect } from "react"
import { Play } from "lucide-react"
import { CloudinaryImage } from "./cloudinary-image"

interface DeferredVimeoPlayerProps {
  videoId: string
  title: string
  thumbnailUrl?: string
}

export function DeferredVimeoPlayer({ videoId, title, thumbnailUrl }: DeferredVimeoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [thumbnail, setThumbnail] = useState(thumbnailUrl)

  useEffect(() => {
    // If no explicit thumbnail is provided, try to fetch it from Vimeo's oEmbed API
    if (!thumbnail) {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
        .then(res => res.json())
        .then(data => {
          if (data.thumbnail_url) {
            setThumbnail(data.thumbnail_url)
          }
        })
        .catch(err => console.error("Failed to fetch Vimeo thumbnail", err))
    }
  }, [videoId, thumbnail])

  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border border-border">
      {!isLoaded ? (
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
          aria-label={`Play ${title}`}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-xl backdrop-blur-sm">
              <Play size={32} className="ml-2" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  )
}
