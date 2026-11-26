import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllPaginated } from "@/lib/api/fetch-all-paginated";
import { servicesService } from "../services/services.service";
import { ServiceRequestPayload } from "../types";

export function useServices(pageIndex: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["services", pageIndex, pageSize],
    queryFn: () => servicesService.getAll(pageIndex, pageSize),
  });
}

// Hook for public facing pages that fetches ALL paginated pages and returns the full flat array
export function usePublicServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: () =>
      fetchAllPaginated((page, size) => servicesService.getAll(page, size), 100),
  });
}

export function useServiceDetails(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => servicesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceRequestPayload) => servicesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ServiceRequestPayload }) =>
      servicesService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.id] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
