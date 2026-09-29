import { httpClient } from "@/lib/api/http-client";
import { ApiResponse, PaginatedList } from "@/types/api";
import { ServiceItem, ServiceRequestPayload } from "../types";

export const servicesService = {
  getAll: (pageIndex: number = 1, pageSize: number = 10) => {
    return httpClient.get<ApiResponse<PaginatedList<ServiceItem>>>(
      `/Services?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  },

  getById: (id: string) => {
    return httpClient.get<ApiResponse<ServiceItem>>(`/Services/${id}`);
  },

  create: (payload: ServiceRequestPayload) => {
    const formData = new FormData();
    formData.append("NameAr", payload.nameAr);
    formData.append("NameEn", payload.nameEn);
    formData.append("DescriptionAr", payload.descriptionAr);
    formData.append("DescriptionEn", payload.descriptionEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    
    if (payload.imageUrl instanceof File) {
      formData.append("Image", payload.imageUrl);
    }
    
    return httpClient.post<ApiResponse<{ id: string }>>("/Services", formData);
  },

  update: (id: string, payload: ServiceRequestPayload) => {
    const formData = new FormData();
    formData.append("NameAr", payload.nameAr);
    formData.append("NameEn", payload.nameEn);
    formData.append("DescriptionAr", payload.descriptionAr);
    formData.append("DescriptionEn", payload.descriptionEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    
    // For update, Image is optional. Only append if it's a new file.
    if (payload.imageUrl instanceof File) {
      formData.append("Image", payload.imageUrl);
    }
    
    return httpClient.put<ApiResponse<{ id: string }>>(`/Services/${id}`, formData);
  },

  delete: (id: string) => {
    return httpClient.delete<ApiResponse<boolean>>(`/Services/${id}`);
  },
};
