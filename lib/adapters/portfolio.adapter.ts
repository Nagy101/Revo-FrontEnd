import { getDataMode } from "./api-interface"
import { httpClient } from "@/lib/api/http-client"
import { mockPortfolios, mockCategories } from "./mock-data"
import { PROVISIONAL_ENDPOINTS } from "@/lib/api/provisional-endpoints"
import type { Portfolio } from "@/types/index"
import type { Category } from "@/features/categories/types"

export const portfolioAdapter = {
  async getPublicPortfolios(): Promise<Portfolio[]> {
    if (getDataMode() === "mock") {
      return mockPortfolios.filter(p => p.isPublished).sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Portfolio[]>(PROVISIONAL_ENDPOINTS.PUBLIC.PORTFOLIOS)
  },

  async getPortfolioBySlugOrId(slugOrId: string): Promise<Portfolio> {
    if (getDataMode() === "mock") {
      const portfolio = mockPortfolios.find(p => p.slug === slugOrId || p.id === slugOrId)
      if (!portfolio) throw new Error("Portfolio not found")
      return portfolio
    }
    return httpClient.get<Portfolio>(PROVISIONAL_ENDPOINTS.PUBLIC.PORTFOLIO_BY_SLUG(slugOrId))
  },

  async getCategories(): Promise<Category[]> {
    if (getDataMode() === "mock") {
      return mockCategories
    }
    return httpClient.get<Category[]>(PROVISIONAL_ENDPOINTS.PUBLIC.CATEGORIES)
  },

  // Admin Methods
  async getAdminPortfolios(): Promise<Portfolio[]> {
    if (getDataMode() === "mock") {
      return [...mockPortfolios].sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Portfolio[]>(PROVISIONAL_ENDPOINTS.ADMIN.PORTFOLIOS)
  },

  async createPortfolio(data: Omit<Portfolio, "id">): Promise<Portfolio> {
    if (getDataMode() === "mock") {
      const newPortfolio = { ...data, id: `p${Date.now()}` }
      mockPortfolios.push(newPortfolio)
      return newPortfolio
    }
    return httpClient.post<Portfolio>(PROVISIONAL_ENDPOINTS.ADMIN.PORTFOLIOS, data)
  },

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    if (getDataMode() === "mock") {
      const index = mockPortfolios.findIndex(p => p.id === id)
      if (index === -1) throw new Error("Portfolio not found")
      mockPortfolios[index] = { ...mockPortfolios[index], ...data }
      return mockPortfolios[index]
    }
    return httpClient.put<Portfolio>(PROVISIONAL_ENDPOINTS.ADMIN.PORTFOLIO(id), data)
  },

  async deletePortfolio(id: string): Promise<void> {
    if (getDataMode() === "mock") {
      const index = mockPortfolios.findIndex(p => p.id === id)
      if (index !== -1) mockPortfolios.splice(index, 1)
      return
    }
    return httpClient.delete<void>(PROVISIONAL_ENDPOINTS.ADMIN.PORTFOLIO(id))
  }
}
