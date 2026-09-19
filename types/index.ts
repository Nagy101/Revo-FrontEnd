/**
 * PROVISIONAL DOMAIN TYPES
 * These types reflect the agreed REVO entities.
 * They are provisional pending the final ASP.NET Core backend API contract.
 */

export interface Portfolio {
  id: string
  titleEn: string
  titleAr?: string
  slug: string
  descriptionEn: string
  descriptionAr?: string
  clientName: string
  categoryId: string
  mediaUrl: string
  mediaType: "image" | "video"
  order: number
  isPublished: boolean
}

export interface Service {
  id: string
  titleEn: string
  titleAr?: string
  slug: string
  descriptionEn: string
  descriptionAr?: string
  icon: string
  order: number
  isPublished: boolean
}

export interface Client {
  id: string
  name: string // Non-bilingual intentionally
  logoUrl: string
  order: number
}

export interface ContactRequest {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  message: string
  status: "new" | "read" | "archived"
  createdAt: string
}

export interface Settings {
  id: string
  whatsappNumber: string
}
