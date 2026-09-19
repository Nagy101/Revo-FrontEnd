import { ClientsManager } from "@/features/admin/components/clients/clients-manager"

export const metadata = {
  title: "Manage Clients | Admin Dashboard",
}

export default function AdminClientsPage() {
  return (
    <div className="flex-1">
      <ClientsManager />
    </div>
  )
}
