import { Portfolio, Service, Client, ContactRequest, Settings } from "@/types/index"
import { Category } from "@/features/categories/types"

export const mockCategories: Category[] = [
  { id: "c1", nameAr: "تطوير الويب", nameEn: "Web Development", imageUrl: "", orderIndex: 1, portfolioItemsCount: 0 },
  { id: "c2", nameAr: "الهوية التجارية", nameEn: "Branding", imageUrl: "", orderIndex: 2, portfolioItemsCount: 0 },
]

export const mockPortfolios: Portfolio[] = [
  {
    id: "p1",
    titleEn: "Revo E-Commerce",
    slug: "revo-ecommerce",
    descriptionEn: "A high-performance e-commerce platform.",
    clientName: "Revo Store",
    categoryId: "c1",
    mediaUrl: "/placeholder.svg?height=800&width=600",
    mediaType: "image",
    order: 1,
    isPublished: true,
  },
  {
    id: "p2",
    titleEn: "Cinematic Brand Anthem",
    slug: "brand-anthem",
    descriptionEn: "A visually striking brand anthem video shot on RED.",
    clientName: "Nike",
    categoryId: "c2",
    mediaUrl: "824804225", // Vimeo ID
    mediaType: "video",
    order: 2,
    isPublished: true,
  },
]

export const mockServices: Service[] = [
  {
    id: "s1",
    titleEn: "Digital Transformation",
    slug: "digital-transformation",
    descriptionEn: "Complete digital overhaul.",
    icon: "code",
    order: 1,
    isPublished: true,
  },
]

export const mockClients: Client[] = [
  { id: "cl1", name: "SODIC", logoUrl: "/placeholder.svg?height=80&width=160", order: 1 },
  { id: "cl2", name: "CAIROKEE BAND", logoUrl: "/placeholder.svg?height=80&width=160", order: 2 },
  { id: "cl3", name: "AMER GROUP HOLDING", logoUrl: "/placeholder.svg?height=80&width=160", order: 3 },
  { id: "cl4", name: "DORRA", logoUrl: "/placeholder.svg?height=80&width=160", order: 4 },
  { id: "cl5", name: "MASSAR EGBARI", logoUrl: "/placeholder.svg?height=80&width=160", order: 5 },
  { id: "cl6", name: "REEDY GROUP", logoUrl: "/placeholder.svg?height=80&width=160", order: 6 },
  { id: "cl7", name: "CITY CLUB", logoUrl: "/placeholder.svg?height=80&width=160", order: 7 },
  { id: "cl8", name: "AZZAR LEGACY", logoUrl: "/placeholder.svg?height=80&width=160", order: 8 },
  { id: "cl9", name: "RAMY GAMAL", logoUrl: "/placeholder.svg?height=80&width=160", order: 9 },
  { id: "cl10", name: "REDA ELBAHRAWY", logoUrl: "/placeholder.svg?height=80&width=160", order: 10 },
  { id: "cl11", name: "MAKER FAIRE CAIRO", logoUrl: "/placeholder.svg?height=80&width=160", order: 11 },
  { id: "cl12", name: "SAN3ATECH", logoUrl: "/placeholder.svg?height=80&width=160", order: 12 },
  { id: "cl13", name: "UPWARD", logoUrl: "/placeholder.svg?height=80&width=160", order: 13 },
  { id: "cl14", name: "TEB SPACE", logoUrl: "/placeholder.svg?height=80&width=160", order: 14 },
  { id: "cl15", name: "RUSHUB", logoUrl: "/placeholder.svg?height=80&width=160", order: 15 },
  { id: "cl16", name: "ICON", logoUrl: "/placeholder.svg?height=80&width=160", order: 16 },
  { id: "cl17", name: "ZG", logoUrl: "/placeholder.svg?height=80&width=160", order: 17 },
  { id: "cl18", name: "PR", logoUrl: "/placeholder.svg?height=80&width=160", order: 18 },
]

export const mockContactRequests: ContactRequest[] = [
  {
    id: "cr1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    message: "Interested in your services.",
    status: "new",
    createdAt: new Date().toISOString(),
  },
]

export const mockSettings: Settings = {
  id: "setting1",
  whatsappNumber: "+1234567890",
}
