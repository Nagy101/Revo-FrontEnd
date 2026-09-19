import { getDataMode } from "./api-interface"
import { httpClient } from "@/lib/api/http-client"
import { mockClients } from "./mock-data"
import { PROVISIONAL_ENDPOINTS } from "@/lib/api/provisional-endpoints"
import type { Client } from "@/types/index"

export const clientsAdapter = {
  async getPublicClients(): Promise<Client[]> {
    if (getDataMode() === "mock") {
      return [...mockClients].sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Client[]>(PROVISIONAL_ENDPOINTS.PUBLIC.CLIENTS)
  },

  // Admin Methods
  async getAdminClients(): Promise<Client[]> {
    if (getDataMode() === "mock") {
      return [...mockClients].sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Client[]>(PROVISIONAL_ENDPOINTS.ADMIN.CLIENTS)
  },

  async createClient(data: Omit<Client, "id">): Promise<Client> {
    if (getDataMode() === "mock") {
      const newClient = { ...data, id: `c${Date.now()}` }
      mockClients.push(newClient)
      return newClient
    }
    return httpClient.post<Client>(PROVISIONAL_ENDPOINTS.ADMIN.CLIENTS, data)
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    if (getDataMode() === "mock") {
      const index = mockClients.findIndex(c => c.id === id)
      if (index === -1) throw new Error("Client not found")
      mockClients[index] = { ...mockClients[index], ...data }
      return mockClients[index]
    }
    return httpClient.put<Client>(PROVISIONAL_ENDPOINTS.ADMIN.CLIENT(id), data)
  },

  async deleteClient(id: string): Promise<void> {
    if (getDataMode() === "mock") {
      const index = mockClients.findIndex(c => c.id === id)
      if (index !== -1) mockClients.splice(index, 1)
      return
    }
    return httpClient.delete<void>(PROVISIONAL_ENDPOINTS.ADMIN.CLIENT(id))
  }
}
