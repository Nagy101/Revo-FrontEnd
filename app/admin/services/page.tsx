import { ServicesManager } from "@/features/admin/components/services/services-manager"

export const metadata = {
  title: "Manage Services | Admin Dashboard",
}

export default function AdminServicesPage() {
  return (
    <div className="flex-1">
      <ServicesManager />
    </div>
  )
}
