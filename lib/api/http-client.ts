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
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
}

export const httpClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint}`
    
    // Ensure credentials (cookies) are sent with every request
    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.status}`, response.status)
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
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    })
  },

  put<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    })
  },

  delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" })
  },
}
