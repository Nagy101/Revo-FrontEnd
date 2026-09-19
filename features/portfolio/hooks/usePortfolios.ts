import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Portfolio } from "@/types/index"
import { portfolioService } from "../services/portfolio.service"

export function usePublicPortfolios() {
  return useQuery({
    queryKey: ["portfolios", "public"],
    queryFn: () => portfolioService.getPublicPortfolios(),
  })
}

export function usePortfolioDetail(slugOrId: string) {
  return useQuery({
    queryKey: ["portfolios", "detail", slugOrId],
    queryFn: () => portfolioService.getPortfolioBySlugOrId(slugOrId),
    enabled: !!slugOrId,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => portfolioService.getCategories(),
  })
}

// Admin Hooks
export function useAdminPortfolios() {
  return useQuery({
    queryKey: ["portfolios", "admin"],
    queryFn: () => portfolioService.getAdminPortfolios(),
  })
}



export function useCreatePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Portfolio, "id">) => portfolioService.createPortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] })
    },
  })
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Portfolio> }) => 
      portfolioService.updatePortfolio(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] })
      queryClient.invalidateQueries({ queryKey: ["portfolios", "detail", variables.id] })
    },
  })
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioService.deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] })
    },
  })
}
