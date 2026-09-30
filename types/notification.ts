export interface NotificationPayload {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  targetUrl?: string; // Optional link to redirect the admin to
  createdAt: string; // ISO Date String
  isRead?: boolean; // Appended for state management
}
