/**
 * PROVISIONAL ENDPOINTS
 * 
 * These endpoints are placeholders for development and do not represent 
 * the finalized ASP.NET Core backend contract. They will be updated once 
 * the backend OpenAPI specification is confirmed.
 * 
 * The frontend must NOT treat these paths as an agreed contract.
 */
export const PROVISIONAL_ENDPOINTS = {
  PUBLIC: {
    PORTFOLIOS: "/provisional-api/public/portfolios",
    PORTFOLIO_BY_SLUG: (slug: string) => `/provisional-api/public/portfolios/${slug}`,
    CATEGORIES: "/provisional-api/public/categories",
    SERVICES: "/provisional-api/public/services",
    SERVICE_BY_SLUG: (slug: string) => `/provisional-api/public/services/${slug}`,
    CLIENTS: "/provisional-api/public/clients"
  },
  ADMIN: {
    PORTFOLIOS: "/provisional-api/admin/portfolios",
    PORTFOLIO: (id: string) => `/provisional-api/admin/portfolios/${id}`,
    SERVICES: "/provisional-api/admin/services",
    SERVICE: (id: string) => `/provisional-api/admin/services/${id}`,
    CLIENTS: "/provisional-api/admin/clients",
    CLIENT: (id: string) => `/provisional-api/admin/clients/${id}`,
  }
}
