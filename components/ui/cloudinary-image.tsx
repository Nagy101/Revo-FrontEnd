"use client"

import Image, { ImageProps } from "next/image"

const cloudinaryLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  // If the src is not a Cloudinary URL (like our mock placeholders), return it as is
  if (!src.includes("cloudinary.com")) return src

  // Parse Cloudinary URL to insert transforms
  // e.g. https://res.cloudinary.com/demo/image/upload/v1612345678/sample.jpg
  // -> https://res.cloudinary.com/demo/image/upload/w_1000,q_auto,f_auto/v1612345678/sample.jpg
  const parts = src.split("/upload/")
  if (parts.length !== 2) return src

  return `${parts[0]}/upload/f_auto,q_${quality || "auto"},w_${width}/${parts[1]}`
}

export function CloudinaryImage(props: ImageProps) {
  return <Image loader={cloudinaryLoader} {...props} />
}
