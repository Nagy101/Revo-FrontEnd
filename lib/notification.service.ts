import apiClient from './apiClient';
import { ApiResponse, PaginatedList } from '@/types/api';
import { NotificationPayload } from '@/types/notification';

export const notificationService = {
  getAll: async (pageIndex = 1, pageSize = 10): Promise<ApiResponse<PaginatedList<NotificationPayload>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedList<NotificationPayload>>>(`/Notifications?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>('/Notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.patch<ApiResponse<boolean>>(`/Notifications/${id}/mark-as-read`);
    return response.data;
  }
};
