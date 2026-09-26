export enum MediaType {
  Image = 1,
  Video = 2
}

export interface PortfolioMedia {
  id?: string; // Optional for new items
  mediaUrl?: string; // URL for existing items
  coverImageUrl?: string | null;
  videoUrl?: string;
  type: MediaType;
  orderIndex: number;
  file?: File | null; // For newly uploaded files
}

export interface PortfolioItem {
  id: string;
  captionAr: string;
  captionEn: string;
  orderIndex: number;
  categoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
  thumbnailUrl: string | null;
  thumbnailType: MediaType | null;
}

export interface PortfolioItemDetails extends PortfolioItem {
  mediaItems: PortfolioMedia[];
}

export interface PortfolioPayload {
  id?: string;
  captionAr: string;
  captionEn: string;
  orderIndex: number;
  categoryId: string;
  mediaItems: PortfolioMedia[];
}
