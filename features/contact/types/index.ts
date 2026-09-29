export interface ContactRequestItem {
  id: string;
  name: string;
  phoneNumber: string;
  message: string;
  isRead: boolean;
  serviceId?: string;
  createdAt: string; // ISO Date String
}

export interface CreateContactRequestPayload {
  name: string;
  phoneNumber: string;
  message: string;
  serviceId?: string;
}
