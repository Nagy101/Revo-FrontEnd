import { httpClient } from "@/lib/api/http-client";
import { ApiResponse, PaginatedList } from "@/types/api";
import { PortfolioItem, PortfolioItemDetails, PortfolioPayload, MediaType } from "../types";

export const portfolioService = {
  getAll: (pageIndex: number = 1, pageSize: number = 10, categoryId?: string) => {
    let url = `/PortfolioItems?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (categoryId && categoryId !== 'all') {
      url += `&categoryId=${categoryId}`;
    }
    return httpClient.get<ApiResponse<PaginatedList<PortfolioItem>>>(url);
  },

  getById: (id: string) => {
    return httpClient.get<ApiResponse<PortfolioItemDetails>>(`/PortfolioItems/${id}`);
  },

  create: (payload: PortfolioPayload) => {
    const formData = new FormData();
    formData.append("CaptionAr", payload.captionAr);
    formData.append("CaptionEn", payload.captionEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    formData.append("CategoryId", payload.categoryId);
    formData.append("IsDeleted", "false");

    payload.mediaItems.forEach((media, index) => {
      formData.append(`MediaItems[${index}].Type`, media.type.toString());
      formData.append(`MediaItems[${index}].OrderIndex`, media.orderIndex.toString());
      
      if (media.type === MediaType.Video) {
        if (media.videoUrl) formData.append(`MediaItems[${index}].VideoUrl`, media.videoUrl);
        if (media.file) formData.append(`MediaItems[${index}].CoverImage`, media.file);
      } else {
        if (media.file) formData.append(`MediaItems[${index}].File`, media.file);
      }
    });

    return httpClient.post<ApiResponse<{ id: string }>>("/PortfolioItems", formData);
  },

  update: (id: string, payload: PortfolioPayload) => {
    const formData = new FormData();
    formData.append("Id", id);
    formData.append("CaptionAr", payload.captionAr);
    formData.append("CaptionEn", payload.captionEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    formData.append("CategoryId", payload.categoryId);
    formData.append("IsDeleted", "false");

    payload.mediaItems.forEach((media, index) => {
      formData.append(`MediaItems[${index}].Type`, media.type.toString());
      formData.append(`MediaItems[${index}].OrderIndex`, media.orderIndex.toString());
      
      // If a new file is uploaded for an existing media item, do NOT send its ID.
      // This forces the backend to delete the old image and upload the new one!
      if (media.id && !media.id.includes("-temp-") && media.id.length > 10 && !media.file) {
        formData.append(`MediaItems[${index}].Id`, media.id);
      }
      
      if (media.type === MediaType.Video) {
        if (media.videoUrl) formData.append(`MediaItems[${index}].VideoUrl`, media.videoUrl);
        if (media.file) formData.append(`MediaItems[${index}].CoverImage`, media.file);
      } else {
        if (media.file) formData.append(`MediaItems[${index}].File`, media.file);
      }
    });

    return httpClient.put<ApiResponse<{ id: string }>>(`/PortfolioItems/${id}`, formData);
  },

  delete: (id: string) => {
    return httpClient.delete<ApiResponse<boolean>>(`/PortfolioItems/${id}`);
  },
};
