"use client"

import { AnalyticsChart } from "@/features/admin/components/dashboard/analytics-chart"
import { StatsCard } from "@/features/admin/components/dashboard/stats-card"
import { BarChart3, Users, FolderKanban, Mailbox } from "lucide-react"
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"

export function AnalyticsManager() {
  const { data, isLoading } = useAnalytics()

  if (isLoading || !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { stats, topContent } = data

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sora text-white mb-2">Analytics Overview</h1>
        <p className="text-white/60">Monitor your agency's performance and engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Views" value={stats.totalViews} change="+12.5%" changeType="positive" index={0} icon={BarChart3} />
        <StatsCard title="Active Projects" value={stats.activeProjects} change="+2" changeType="positive" index={1} icon={FolderKanban} />
        <StatsCard title="Contact Requests" value={stats.pendingReservations} change="-1" changeType="negative" index={2} icon={Mailbox} />
        <StatsCard title="Newsletter Subs" value={stats.newsletterSubscribers} change="+5.2%" changeType="positive" index={3} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold font-sora text-white mb-6">Traffic Overview</h2>
          <AnalyticsChart title="Traffic" />
        </div>

        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold font-sora text-white mb-6">Top Performing Content</h2>
          <div className="space-y-4">
            {topContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <p className="text-white font-medium">{content.title}</p>
                  <p className="text-white/50 text-sm mt-1">{content.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{content.views.toLocaleString()}</p>
                  <p className="text-primary text-xs font-semibold tracking-wider uppercase mt-1">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
