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
  {
    id: "cl1",
    name: "Acme Corp",
    logoUrl: "/placeholder.svg?height=80&width=160",
    order: 1,
  },
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
