/**
 * HTTP Client for ASP.NET Core Backend
 * Configured to send and receive HttpOnly cookies for authentication automatically.
 * Does not store tokens in localStorage/sessionStorage.
 */

export class ApiError extends Error {
  status: number
  data?: any
  
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.name = "ApiError"
    this.data = data
  }
}

export function extractApiErrorMessage(errorData: any, status?: number): string {
  if (!errorData) {
    return status ? `Request failed with status ${status}` : "An unexpected error occurred.";
  }

  if (typeof errorData === "string" && errorData.trim()) {
    try {
      const parsed = JSON.parse(errorData);
      return extractApiErrorMessage(parsed, status);
    } catch {
      return errorData;
    }
  }

  // 1. Check errors array or object first (specifically for detailed field / validation errors)
  if (errorData.errors) {
    // Array of errors: [{ code, message }] or [{ code, errorMessage }] or strings ["..."]
    if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      const messages = errorData.errors
        .map((err: any) => {
          if (typeof err === "string") return err;
          return err.message || err.errorMessage || err.description || (err.code ? `${err.code}` : "");
        })
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(" • ");
      }
    }

    // Object of field errors (ASP.NET ModelState ValidationProblemDetails): { "PhoneNumber": ["Phone number must be 11 digits."] }
    if (typeof errorData.errors === "object" && !Array.isArray(errorData.errors)) {
      const messages = Object.entries(errorData.errors)
        .flatMap(([_, msgs]: [string, any]) => {
          if (Array.isArray(msgs)) {
            return msgs.map((m: any) => (typeof m === "string" ? m : m.message || m.errorMessage || ""));
          }
          if (typeof msgs === "string") return [msgs];
          return [];
        })
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(" • ");
      }
    }

    // Direct string
    if (typeof errorData.errors === "string" && errorData.errors.trim()) {
      return errorData.errors;
    }
  }

  // 2. Singular error object or string
  if (errorData.error) {
    if (typeof errorData.error === "string" && errorData.error.trim()) return errorData.error;
    if (typeof errorData.error.message === "string" && errorData.error.message.trim()) return errorData.error.message;
  }

  // 3. Check errorData.message
  if (typeof errorData.message === "string" && errorData.message.trim()) {
    return errorData.message;
  }

  // 4. ProblemDetails fields
  if (typeof errorData.detail === "string" && errorData.detail.trim()) {
    return errorData.detail;
  }

  if (typeof errorData.title === "string" && errorData.title.trim()) {
    return errorData.title;
  }

  return status ? `HTTP Error: ${status}` : "An unexpected error occurred.";
}

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || "https://revo-media.net/api"
  return base.replace(/\/+$/, "")
}

export const httpClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${getBaseUrl()}${cleanEndpoint}`
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {})
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      credentials: "include", // kept for backwards compatibility if needed
      headers,
    }

    // Clean up Content-Type if we explicitly set it to empty string or if it's not meant to be JSON
    // A cleaner approach: if body is FormData, don't set Content-Type
    if (config.body instanceof FormData) {
      if (config.headers && typeof config.headers === 'object') {
        const headersRecord = config.headers as Record<string, string>;
        if (headersRecord['Content-Type'] === 'application/json') {
          delete headersRecord['Content-Type'];
        }
      }
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.href = '/admin/auth';
        }
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = null;
      }

      const detailedMessage = extractApiErrorMessage(errorData, response.status);
      const error = new ApiError(detailedMessage, response.status, errorData);
      (error as any).data = errorData;
      (error as any).response = { status: response.status, data: errorData }; // Align with Axios error format
      throw error;
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  },

  get<T>(endpoint: string, options: RequestInit = {}) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" })
  },

  post<T>(endpoint: string, body: any, options: RequestInit = {}) {
    const isFormData = body instanceof FormData
    const headers = { ...options.headers } as Record<string, string>
    if (isFormData && headers["Content-Type"] === "application/json") {
      delete headers["Content-Type"]
    }

    return this.fetch<T>(endpoint, {
      ...options,
      headers: isFormData ? headers : options.headers,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    })
  },

  put<T>(endpoint: string, body: any, options: RequestInit = {}) {
    const isFormData = body instanceof FormData
    const headers = { ...options.headers } as Record<string, string>
    if (isFormData && headers["Content-Type"] === "application/json") {
      delete headers["Content-Type"]
    }

    return this.fetch<T>(endpoint, {
      ...options,
      headers: isFormData ? headers : options.headers,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    })
  },

  delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" })
  },
}
