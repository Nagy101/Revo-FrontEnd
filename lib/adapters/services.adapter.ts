import { getDataMode } from "./api-interface"
import { httpClient } from "@/lib/api/http-client"
import { mockServices } from "./mock-data"
import { PROVISIONAL_ENDPOINTS } from "@/lib/api/provisional-endpoints"
import type { Service } from "@/types/index"

export const servicesAdapter = {
  async getPublicServices(): Promise<Service[]> {
    if (getDataMode() === "mock") {
      return mockServices.filter(s => s.isPublished).sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Service[]>(PROVISIONAL_ENDPOINTS.PUBLIC.SERVICES)
  },

  async getServiceBySlugOrId(slugOrId: string): Promise<Service> {
    if (getDataMode() === "mock") {
      const service = mockServices.find(s => s.slug === slugOrId || s.id === slugOrId)
      if (!service) throw new Error("Service not found")
      return service
    }
    return httpClient.get<Service>(PROVISIONAL_ENDPOINTS.PUBLIC.SERVICE_BY_SLUG(slugOrId))
  },

  // Admin Methods
  async getAdminServices(): Promise<Service[]> {
    if (getDataMode() === "mock") {
      return [...mockServices].sort((a, b) => a.order - b.order)
    }
    return httpClient.get<Service[]>(PROVISIONAL_ENDPOINTS.ADMIN.SERVICES)
  },

  async createService(data: Omit<Service, "id">): Promise<Service> {
    if (getDataMode() === "mock") {
      const newService = { ...data, id: `s${Date.now()}` }
      mockServices.push(newService)
      return newService
    }
    return httpClient.post<Service>(PROVISIONAL_ENDPOINTS.ADMIN.SERVICES, data)
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    if (getDataMode() === "mock") {
      const index = mockServices.findIndex(s => s.id === id)
      if (index === -1) throw new Error("Service not found")
      mockServices[index] = { ...mockServices[index], ...data }
      return mockServices[index]
    }
    return httpClient.put<Service>(PROVISIONAL_ENDPOINTS.ADMIN.SERVICE(id), data)
  },

  async deleteService(id: string): Promise<void> {
    if (getDataMode() === "mock") {
      const index = mockServices.findIndex(s => s.id === id)
      if (index !== -1) mockServices.splice(index, 1)
      return
    }
    return httpClient.delete<void>(PROVISIONAL_ENDPOINTS.ADMIN.SERVICE(id))
  }
}
