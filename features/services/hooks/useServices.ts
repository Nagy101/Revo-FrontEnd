import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "../services/services.service";
import { ServiceRequestPayload } from "../types";

export function useServices(pageIndex: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["services", pageIndex, pageSize],
    queryFn: () => servicesService.getAll(pageIndex, pageSize),
  });
}

// Hook for public facing pages that just need the flat array of services
export function usePublicServices() {
  const query = useServices(1, 100);
  return {
    ...query,
    data: query.data?.data?.data || [],
  };
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
