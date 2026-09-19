import { PortfolioManager } from "@/features/admin/components/portfolio/portfolio-manager"

export const metadata = {
  title: "Manage Portfolio | Admin Dashboard",
}

export default function AdminPortfolioPage() {
  return (
    <div className="flex-1">
      <PortfolioManager />
    </div>
  )
}
