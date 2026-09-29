import { PaginatedList } from "@/types/api";

export interface ServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  orderIndex: number;
}

export interface ServiceRequestPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  orderIndex: number;
  imageUrl?: string | File;
}
