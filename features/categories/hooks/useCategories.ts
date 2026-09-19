import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categories.service";
import { CategoryRequestPayload } from "../types";

export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, "list"] as const,
  list: (filters: { pageIndex: number; pageSize: number }) => [...CATEGORY_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string, filters?: { pageIndex: number; pageSize: number }) => [...CATEGORY_QUERY_KEYS.details(), id, filters] as const,
};

export const useCategories = (pageIndex: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.list({ pageIndex, pageSize }),
    queryFn: () => categoriesService.getAll(pageIndex, pageSize),
  });
};

export const useCategory = (id: string, pageIndex: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id, { pageIndex, pageSize }),
    queryFn: () => categoriesService.getById(id, pageIndex, pageSize),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CategoryRequestPayload) => categoriesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryRequestPayload }) => 
      categoriesService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
    },
  });
};
