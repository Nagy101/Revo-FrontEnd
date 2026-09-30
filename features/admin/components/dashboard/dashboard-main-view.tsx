"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FolderOpen, Calendar, FileText, TrendingUp, Eye, Clock, Star } from "lucide-react"
import { StatsCard } from "./stats-card"
import { AnalyticsChart } from "./analytics-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { portfolioAdapter } from "@/lib/adapters/portfolio.adapter"
import { servicesAdapter } from "@/lib/adapters/services.adapter"
import type { Portfolio } from "@/types/index"

export function DashboardMainView() {
  const [adminStats, setAdminStats] = useState({
    totalViews: 0,
    activeProjects: 0,
    pendingReservations: 0,
    newsletterSubscribers: 0,
    totalVisitors: 0,
    todayVisitors: 0,
    weeklyGrowth: 0,
    servicesCount: 0,
    contactRequests: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Portfolio[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [portfolios, services] = await Promise.all([
          portfolioAdapter.getAdminPortfolios().catch(() => []),
          servicesAdapter.getAdminServices().catch(() => [])
        ]);

        const publishedPortfolios = portfolios.filter(p => p.isPublished);

        setAdminStats(prev => ({
          ...prev,
          activeProjects: publishedPortfolios.length,
          servicesCount: services.length,
        }));

        setRecentProjects(portfolios.slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-sora text-white">Dashboard</h1>
        <p className="text-white/60 text-sm mt-1">Welcome back! Here's what's happening with your agency.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Visitors"
          value={adminStats.totalVisitors.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          index={0}
        />
        <StatsCard
          title="Active Projects"
          value={adminStats.activeProjects}
          change="Currently published"
          changeType="positive"
          icon={FolderOpen}
          index={1}
        />
        <StatsCard
          title="Contact Requests"
          value={adminStats.contactRequests}
          change="Waiting for reply"
          changeType="neutral"
          icon={Calendar}
          index={2}
        />
        <StatsCard
          title="Services"
          value={adminStats.servicesCount}
          change="Active offerings"
          changeType="positive"
          icon={FileText}
          index={3}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart title="Overview" />

        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "success"
                        ? "bg-green-400"
                        : notification.type === "warning"
                          ? "bg-yellow-400"
                          : notification.type === "error"
                            ? "bg-red-400"
                            : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{notification.title}</p>
                    <p className="text-white/60 text-xs">{notification.message}</p>
                    <p className="text-white/40 text-xs mt-1">{notification.timestamp?.toLocaleTimeString()}</p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 bg-red-600 rounded-full" />}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/50 text-sm">
                No recent activity.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Projects</CardTitle>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={project.mediaUrl || "/placeholder.svg"}
                      alt={project.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                        {project.titleEn}
                      </h3>
                    </div>
                    <p className="text-white/60 text-xs line-clamp-2">{project.descriptionEn}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-xs ${
                          project.isPublished
                            ? "bg-green-600/20 text-green-400 border-green-600/30"
                            : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                        }`}
                      >
                        {project.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <span className="text-white/40 text-xs">{project.clientName}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/50 text-sm">
              No recent projects found. 
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Today's Visitors</p>
                <p className="text-white text-xl font-bold">{adminStats.todayVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Weekly Growth</p>
                <p className="text-white text-xl font-bold">+{adminStats.weeklyGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Avg. Response Time</p>
                <p className="text-white text-xl font-bold">2.4h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
