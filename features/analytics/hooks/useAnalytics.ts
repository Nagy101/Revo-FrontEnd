import { useQuery } from "@tanstack/react-query"

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      // Dummy hook resolving mock analytics data
      return {
        stats: {
          totalViews: 24500,
          activeProjects: 12,
          pendingReservations: 8,
          newsletterSubscribers: 1205,
        },
        traffic: [
          { name: "Jan", value: 4000 },
          { name: "Feb", value: 3000 },
          { name: "Mar", value: 5000 },
          { name: "Apr", value: 4500 },
          { name: "May", value: 6000 },
          { name: "Jun", value: 5500 },
        ],
        topContent: [
          { id: 1, title: "Digital Transformation", type: "Portfolio Project", views: 1245 },
          { id: 2, title: "Video Production", type: "Service", views: 856 },
          { id: 3, title: "Acme Corp Branding", type: "Portfolio Project", views: 743 },
        ]
      }
    }
  })
}
