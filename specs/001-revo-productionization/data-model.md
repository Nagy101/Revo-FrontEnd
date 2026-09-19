# Data Model

This document outlines the core domain entities. Because the backend API contract is not yet finalized, these models are provisional. They incorporate explicit bilingual requirements for all user-facing content.

## 1. Portfolio
Represents an agency project showcase.
- `id`: string (UUID)
- `categoryId`: string (UUID) - Foreign key to Category
- `titleEn`: string (English title)
- `titleAr`: string (Arabic title)
- `descriptionEn`: string (English description)
- `descriptionAr`: string (Arabic description)
- `clientNameEn`: string (English client name)
- `clientNameAr`: string (Arabic client name)
- `featured`: boolean
- `status`: enum (`published` | `draft`)
- `media`: array of `MediaItem` objects
- `orderIndex`: integer

### MediaItem (Value Object)
- `id`: string (UUID)
- `type`: enum (`image` | `video`)
- `url`: string (Cloudinary URL or Vimeo ID/URL)
- `orderIndex`: integer
- `altTextEn`: string
- `altTextAr`: string

## 2. Category
Used to group portfolio items (e.g., "Web Design", "Branding").
- `id`: string (UUID)
- `nameEn`: string
- `nameAr`: string
- `slug`: string
- `orderIndex`: integer
- `status`: enum (`published` | `draft`)

## 3. Service
Represents an agency offering.
- `id`: string (UUID)
- `titleEn`: string
- `titleAr`: string
- `descriptionEn`: string
- `descriptionAr`: string
- `lottieAssetUrl`: string
- `orderIndex`: integer
- `status`: enum (`published` | `draft`)

## 4. Client
Represents a past client displayed in the marquee.
- `id`: string (UUID)
- `nameEn`: string
- `nameAr`: string
- `logoUrl`: string (Cloudinary URL)
- `orderIndex`: integer
- `status`: enum (`published` | `draft`)

## 5. ContactRequest
Represents a submitted inquiry.
- `id`: string (UUID)
- `name`: string
- `email`: string
- `phone`: string
- `message`: string
- `status`: enum (`pending` | `reviewed`)
- `createdAt`: string (ISO 8601 Date)
- `antiSpamToken`: string (for submission validation)

## 6. Settings
Global configuration variables managed by admins.
- `id`: string (UUID)
- `whatsappNumber`: string
