export interface NotificationPayload {
  id: string;
  titleAr?: string | null;
  titleEn: string;
  messageAr?: string | null;
  messageEn: string;
  targetUrl?: string; // Optional link to redirect the admin to
  createdAt: string; // ISO Date String
  isRead?: boolean; // Appended for state management
}
