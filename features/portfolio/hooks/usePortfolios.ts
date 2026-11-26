import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllPaginated } from "@/lib/api/fetch-all-paginated";
import { portfolioService } from "../services/portfolio.service";
import { PortfolioPayload } from "../types";

export const PORTFOLIO_QUERY_KEYS = {
  all: ["portfolios"] as const,
  lists: () => [...PORTFOLIO_QUERY_KEYS.all, "list"] as const,
  list: (filters: { pageIndex: number; pageSize: number; categoryId?: string }) => [...PORTFOLIO_QUERY_KEYS.lists(), filters] as const,
  publicAll: () => [...PORTFOLIO_QUERY_KEYS.all, "public-all"] as const,
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
    queryKey: PORTFOLIO_QUERY_KEYS.publicAll(),
    queryFn: () =>
      fetchAllPaginated((page, size) => portfolioService.getAll(page, size), 100),
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
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PortfolioPayload }) => 
      portfolioService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => portfolioService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all });
    },
  });
};
