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
    
    // Ensure credentials (cookies) are sent with every request
    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: options.headers || {
        "Content-Type": "application/json",
      },
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
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = null;
      }
      const error = new ApiError(errorData?.message || `HTTP Error: ${response.status}`, response.status);
      (error as any).data = errorData;
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
