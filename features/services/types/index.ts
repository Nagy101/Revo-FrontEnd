export interface ServiceItem {
  id: string;
  nameAr?: string | null;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn: string;
  imageUrl?: string | null;
  orderIndex: number;
}

export interface ServiceRequestPayload {
  nameAr?: string | null;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn: string;
  orderIndex: number;
  imageUrl?: string | File | null;
}
