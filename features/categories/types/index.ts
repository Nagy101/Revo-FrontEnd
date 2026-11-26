import { PaginatedList } from "@/types/api";

// Model for Category Item (used in GET All)
export interface Category {
  id: string; // uuid
  nameAr?: string | null;
  nameEn: string;
  imageUrl?: string | null;
  orderIndex: number;
  portfolioItemsCount: number;
}

// Model for Portfolio Item inside a specific Category
export interface CategoryPortfolioItem {
  id: string; // uuid
  captionAr?: string | null;
  captionEn: string;
  orderIndex: number;
  mainImageUrl?: string | null;
}

// Model for Category Details (used in GET by Id)
export interface CategoryDetails {
  id: string; // uuid
  nameAr?: string | null;
  nameEn: string;
  imageUrl?: string | null;
  orderIndex: number;
  items: PaginatedList<CategoryPortfolioItem>;
}

// Models for POST / PUT Requests
export interface CategoryRequestPayload {
  nameAr?: string | null;
  nameEn: string;
  orderIndex: number;
  imageUrl?: string | File | null;
}
