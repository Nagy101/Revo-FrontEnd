import { httpClient } from "@/lib/api/http-client";
import { ApiResponse, PaginatedList } from "@/types/api";
import { Category, CategoryDetails, CategoryRequestPayload } from "../types";

export const categoriesService = {
  getAll: (pageIndex: number = 1, pageSize: number = 10) => {
    return httpClient.get<ApiResponse<PaginatedList<Category>>>(
      `/Categories?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  },

  getById: (id: string, pageIndex: number = 1, pageSize: number = 10) => {
    return httpClient.get<ApiResponse<CategoryDetails>>(
      `/Categories/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  },

  create: (payload: CategoryRequestPayload) => {
    const formData = new FormData();
    formData.append("NameAr", payload.nameAr);
    formData.append("NameEn", payload.nameEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    if (payload.imageUrl instanceof File) {
      formData.append("Image", payload.imageUrl);
    }
    return httpClient.post<ApiResponse<{ id: string }>>("/Categories", formData);
  },

  update: (id: string, payload: CategoryRequestPayload) => {
    const formData = new FormData();
    formData.append("NameAr", payload.nameAr);
    formData.append("NameEn", payload.nameEn);
    formData.append("OrderIndex", payload.orderIndex.toString());
    if (payload.imageUrl instanceof File) {
      formData.append("Image", payload.imageUrl);
    }
    return httpClient.put<ApiResponse<{ id: string }>>(`/Categories/${id}`, formData);
  },

  delete: (id: string) => {
    return httpClient.delete<ApiResponse<boolean>>(`/Categories/${id}`);
  },
};
