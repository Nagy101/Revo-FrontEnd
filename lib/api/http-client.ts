/**
 * HTTP Client for ASP.NET Core Backend
 * Configured to send and receive HttpOnly cookies for authentication automatically.
 * Does not store tokens in localStorage/sessionStorage.
 */

export class ApiError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "https://localhost:7286/api"
}

export const httpClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint}`
    
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
      const error = new ApiError(errorData?.message || `HTTP Error: ${response.status}`, response.status);
      (error as any).data = errorData;
      (error as any).response = { status: response.status, data: errorData }; // Align with Axios error format just in case
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
