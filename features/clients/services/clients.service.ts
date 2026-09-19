import { clientsAdapter } from "@/lib/adapters/clients.adapter"
import type { Client } from "@/types/index"

export const clientsService = {
  getPublicClients(): Promise<Client[]> {
    return clientsAdapter.getPublicClients()
  },
  
  getAdminClients(): Promise<Client[]> {
    return clientsAdapter.getAdminClients()
  },

  createClient(data: Omit<Client, "id">): Promise<Client> {
    return clientsAdapter.createClient(data)
  },

  updateClient(id: string, data: Partial<Client>): Promise<Client> {
    return clientsAdapter.updateClient(id, data)
  },

  deleteClient(id: string): Promise<void> {
    return clientsAdapter.deleteClient(id)
  }
}
