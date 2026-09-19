import { portfolioAdapter } from "@/lib/adapters/portfolio.adapter"
import type { Portfolio } from "@/types/index"
import type { Category } from "@/features/categories/types"

export const portfolioService = {
  getPublicPortfolios(): Promise<Portfolio[]> {
    return portfolioAdapter.getPublicPortfolios()
  },
  
  getPortfolioBySlugOrId(slugOrId: string): Promise<Portfolio> {
    return portfolioAdapter.getPortfolioBySlugOrId(slugOrId)
  },

  getCategories(): Promise<Category[]> {
    return portfolioAdapter.getCategories()
  },
  getAdminPortfolios(): Promise<Portfolio[]> {
    return portfolioAdapter.getAdminPortfolios()
  },
  createPortfolio(data: Omit<Portfolio, "id">): Promise<Portfolio> {
    return portfolioAdapter.createPortfolio(data)
  },
  updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    return portfolioAdapter.updatePortfolio(id, data)
  },
  deletePortfolio(id: string): Promise<void> {
    return portfolioAdapter.deletePortfolio(id)
  }
}
