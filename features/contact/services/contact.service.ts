import { httpClient } from "@/lib/api/http-client";
import { ApiResponse, PaginatedList } from "@/types/api";
import { ContactRequestItem, CreateContactRequestPayload } from "../types";

export const contactRequestsService = {
  create: (payload: CreateContactRequestPayload) => {
    // Expected to accept JSON implicitly since body is a plain object
    return httpClient.post<ApiResponse<{ id: string }>>("/ContactRequests", payload);
  },

  getAll: (pageIndex: number = 1, pageSize: number = 10, isRead?: boolean) => {
    let url = `/ContactRequests?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (isRead !== undefined) {
      url += `&isRead=${isRead}`;
    }
    return httpClient.get<ApiResponse<PaginatedList<ContactRequestItem>>>(url);
  },

  getById: (id: string) => {
    return httpClient.get<ApiResponse<ContactRequestItem>>(`/ContactRequests/${id}`);
  },

  markAsRead: (id: string) => {
    return httpClient.fetch<ApiResponse<boolean>>(`/ContactRequests/${id}/mark-as-read`, {
      method: "PATCH"
    });
  }
};
