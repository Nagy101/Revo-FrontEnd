import { servicesAdapter } from "@/lib/adapters/services.adapter"
import type { Service } from "@/types/index"

export const servicesFeatureService = {
  getPublicServices(): Promise<Service[]> {
    return servicesAdapter.getPublicServices()
  },
  
  getServiceBySlugOrId(slugOrId: string): Promise<Service> {
    return servicesAdapter.getServiceBySlugOrId(slugOrId)
  },

  getAdminServices(): Promise<Service[]> {
    return servicesAdapter.getAdminServices()
  },

  createService(data: Omit<Service, "id">): Promise<Service> {
    return servicesAdapter.createService(data)
  },

  updateService(id: string, data: Partial<Service>): Promise<Service> {
    return servicesAdapter.updateService(id, data)
  },

  deleteService(id: string): Promise<void> {
    return servicesAdapter.deleteService(id)
  }
}
