import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "../services/portfolio.service";
import { PortfolioPayload } from "../types";

export const PORTFOLIO_QUERY_KEYS = {
  all: ["portfolios"] as const,
  lists: () => [...PORTFOLIO_QUERY_KEYS.all, "list"] as const,
  list: (filters: { pageIndex: number; pageSize: number; categoryId?: string }) => [...PORTFOLIO_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PORTFOLIO_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PORTFOLIO_QUERY_KEYS.details(), id] as const,
};

export const usePortfolios = (pageIndex: number = 1, pageSize: number = 10, categoryId?: string) => {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.list({ pageIndex, pageSize, categoryId }),
    queryFn: () => portfolioService.getAll(pageIndex, pageSize, categoryId),
  });
};

export const usePublicPortfolios = () => {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.list({ pageIndex: 1, pageSize: 50 }),
    queryFn: () => portfolioService.getAll(1, 50),
    select: (res) => res.data?.data || []
  });
};

export const usePortfolioDetails = (id: string | null) => {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.detail(id!),
    queryFn: () => portfolioService.getById(id!),
    enabled: !!id,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: PortfolioPayload) => portfolioService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.lists() });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PortfolioPayload }) => 
      portfolioService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.detail(variables.id) });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => portfolioService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.lists() });
    },
  });
};
