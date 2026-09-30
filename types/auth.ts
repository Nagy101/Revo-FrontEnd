export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  isAuthenticated: boolean;
  expireOn: string; // ISO Date String
  email: string;
  name: string;
  roles: string[];
}
