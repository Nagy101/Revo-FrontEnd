import { httpClient } from "@/lib/api/http-client";
import { ApiResponse, PaginatedList } from "@/types/api";
import { ContactRequestItem, CreateContactRequestPayload } from "../types";

export const contactRequestsService = {
  create: (payload: CreateContactRequestPayload) => {
    const isGuid = (val?: string) =>
      typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());

    // Normalize Egyptian phone number (strip +20, 0020, spaces, dashes)
    let cleanPhone = payload.phoneNumber.trim().replace(/[\s-]/g, "");
    if (cleanPhone.startsWith("+20")) cleanPhone = cleanPhone.slice(2);
    else if (cleanPhone.startsWith("0020")) cleanPhone = cleanPhone.slice(4);
    else if (cleanPhone.startsWith("+2")) cleanPhone = cleanPhone.slice(2);

    let messageText = payload.message.trim();

    const body: Record<string, any> = {
      name: payload.name.trim(),
      phoneNumber: cleanPhone,
      message: messageText || "Inquiry submitted via REVO Contact Portal",
    };

    const rawServiceId = payload.serviceId?.trim();
    if (rawServiceId && isGuid(rawServiceId)) {
      body.serviceId = rawServiceId;
    } else if (rawServiceId) {
      // Append non-guid service name/slug into the message so it's not lost
      body.message = `[Service: ${rawServiceId}] ${body.message}`;
    }

    return httpClient.post<ApiResponse<{ id: string }>>("/ContactRequests", body);
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
