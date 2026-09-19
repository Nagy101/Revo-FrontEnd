import { AnalyticsManager } from "@/features/admin/components/analytics/analytics-manager"

export const metadata = {
  title: "Analytics | Admin Dashboard",
}

export default function AdminAnalyticsPage() {
  return (
    <div className="flex-1">
      <AnalyticsManager />
    </div>
  )
}
