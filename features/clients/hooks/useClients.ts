import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { clientsService } from "../services/clients.service"
import type { Client } from "@/types/index"

export function usePublicClients() {
  return useQuery({
    queryKey: ["clients", "public"],
    queryFn: () => clientsService.getPublicClients(),
  })
}

// Admin Hooks
export function useAdminClients() {
  return useQuery({
    queryKey: ["clients", "admin"],
    queryFn: () => clientsService.getAdminClients(),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Client, "id">) => clientsService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => 
      clientsService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}
