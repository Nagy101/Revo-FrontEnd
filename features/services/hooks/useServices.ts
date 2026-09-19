import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Service } from "@/types/index"
import { servicesFeatureService } from "../services/services.service"

export function usePublicServices() {
  return useQuery({
    queryKey: ["services", "public"],
    queryFn: () => servicesFeatureService.getPublicServices(),
  })
}

export function useServiceDetail(slugOrId: string) {
  return useQuery({
    queryKey: ["services", "detail", slugOrId],
    queryFn: () => servicesFeatureService.getServiceBySlugOrId(slugOrId),
    enabled: !!slugOrId,
  })
}

// Admin Hooks
export function useAdminServices() {
  return useQuery({
    queryKey: ["services", "admin"],
    queryFn: () => servicesFeatureService.getAdminServices(),
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Service, "id">) => servicesFeatureService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => 
      servicesFeatureService.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      queryClient.invalidateQueries({ queryKey: ["services", "detail", variables.id] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesFeatureService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}
