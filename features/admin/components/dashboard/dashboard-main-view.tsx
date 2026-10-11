"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  FolderOpen, Tags, Wrench, MessageSquare, ArrowUpRight, 
  CheckCircle2, Video, Image as ImageIcon, 
  ChevronRight, Phone, ArrowRight,
  PieChart, BarChart3, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { usePortfolios } from "@/features/portfolio/hooks/usePortfolios"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { useServices } from "@/features/services/hooks/useServices"
import { useContactRequests } from "@/features/contact/hooks/useContactRequests"
import { MediaType, PortfolioItem } from "@/features/portfolio/types"
import { ServiceItem } from "@/features/services/types"
import { ContactRequestItem } from "@/features/contact/types"

export function DashboardMainView() {
  // Fetch real data from all 4 live endpoints
  const { 
    data: portfoliosData, 
    isLoading: portfoliosLoading, 
    refetch: refetchPortfolios 
  } = usePortfolios(1, 100)

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    refetch: refetchCategories 
  } = useCategories(1, 100)

  const { 
    data: servicesData, 
    isLoading: servicesLoading, 
    refetch: refetchServices 
  } = useServices(1, 100)

  const { 
    data: contactsData, 
    isLoading: contactsLoading, 
    refetch: refetchContacts 
  } = useContactRequests(1, 100)

  const isGlobalLoading = portfoliosLoading || categoriesLoading || servicesLoading || contactsLoading

  // Extract typed arrays safely
  const portfolios: PortfolioItem[] = portfoliosData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const services: ServiceItem[] = servicesData?.data?.data || []
  const contactRequests: ContactRequestItem[] = contactsData?.data?.data || []

  // ─── 100% REAL CALCULATIONS (ZERO FAKE DATA) ───
  const totalProjects = portfolios.length
  const videoProjects = portfolios.filter(p => p.thumbnailType === MediaType.Video).length
  const imageProjects = portfolios.filter(p => p.thumbnailType === MediaType.Image).length

  const totalCategories = categories.length
  const totalServices = services.length

  const totalInquiries = contactRequests.length
  const unreadInquiries = contactRequests.filter(r => !r.isRead).length
  const readInquiries = totalInquiries - unreadInquiries

  // Calculate project distribution per real category
  const categoryStats = categories.map((cat, idx) => {
    const projectCount = portfolios.filter(p => p.categoryId === cat.id).length
    const pct = totalProjects > 0 ? Math.round((projectCount / totalProjects) * 100) : 0
    const colors = ["#C3143D", "#f43f5e", "#fb7185", "#e11d48", "#be123c", "#9f1239"]
    return {
      id: cat.id,
      name: cat.nameEn || cat.nameAr || `Category ${idx + 1}`,
      nameAr: cat.nameAr,
      count: projectCount,
      percentage: pct,
      color: colors[idx % colors.length]
    }
  }).sort((a, b) => b.count - a.count)

  const handleRefreshAll = () => {
    refetchPortfolios()
    refetchCategories()
    refetchServices()
    refetchContacts()
  }

  return (
    <div className="flex-1 space-y-8 pb-12 selection:bg-[#C3143D] selection:text-white">

      {/* ── HEADER & LIVE DATABASE SYNC ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold">
              Live Database Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Real-time analytics and statistics calculated directly from your website's database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isGlobalLoading}
            className="border-white/15 bg-black/40 hover:bg-white/10 text-white text-xs h-9 px-3 rounded-xl gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C3143D] ${isGlobalLoading ? "animate-spin" : ""}`} />
            <span>Sync Data</span>
          </Button>

          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-black/40 hover:bg-white/10 text-white text-xs h-9 px-3 rounded-xl gap-1.5"
            >
              <span>Live Website</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 1. REAL KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Projects KPI */}
        <Link href="/admin/portfolio" className="block group">
          <Card className="bg-black/50 backdrop-blur-xl border-white/10 group-hover:border-[#C3143D]/50 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Portfolio Items</span>
                <div className="w-9 h-9 rounded-xl bg-[#C3143D]/15 border border-[#C3143D]/30 flex items-center justify-center text-[#C3143D] group-hover:scale-105 transition-transform">
                  <FolderOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-sora">
                {totalProjects}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-white/[0.06] text-white/50 font-mono">
                <span>{videoProjects} Videos</span>
                <span>{imageProjects} Photos</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Categories KPI */}
        <Link href="/admin/categories" className="block group">
          <Card className="bg-black/50 backdrop-blur-xl border-white/10 group-hover:border-[#C3143D]/50 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Categories</span>
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <Tags className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-sora">
                {totalCategories}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-white/[0.06] text-white/50">
                <span>Active Sections</span>
                <span className="text-rose-400 font-medium">Manage →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Services KPI */}
        <Link href="/admin/services" className="block group">
          <Card className="bg-black/50 backdrop-blur-xl border-white/10 group-hover:border-[#C3143D]/50 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Services</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-sora">
                {totalServices}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-white/[0.06] text-white/50">
                <span>Published Services</span>
                <span className="text-amber-400 font-medium">Manage →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Contact Requests KPI */}
        <Link href="/admin/contact-requests" className="block group">
          <Card className="bg-black/50 backdrop-blur-xl border-white/10 group-hover:border-[#C3143D]/50 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Contact Requests</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-sora">
                {totalInquiries}
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-white/[0.06] text-white/50">
                <span className={unreadInquiries > 0 ? "text-amber-400 font-bold" : "text-white/50"}>
                  {unreadInquiries} New Inquiries
                </span>
                <span className="text-emerald-400 font-medium">{readInquiries} Handled</span>
              </div>
            </CardContent>
          </Card>
        </Link>

      </div>

      {/* ── 2. REAL DATA VISUAL CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART 1: Real Category Project Distribution */}
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <CardTitle className="text-white text-base font-bold font-sora flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#C3143D]" />
                <span>Projects by Category</span>
              </CardTitle>
              <CardDescription className="text-white/50 text-xs mt-0.5">
                Exact distribution of projects across your created categories
              </CardDescription>
            </div>
            <Link href="/admin/categories" className="text-xs text-[#C3143D] hover:underline">
              Add Category
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-white/50">{item.count} items</span>
                      <span className="text-white font-bold w-10 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-white/40 text-xs">
                <Tags className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p>No categories found in database.</p>
                <Link href="/admin/categories" className="inline-block mt-2 text-[#C3143D] hover:underline">
                  Create your first category →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CHART 2: Real Content Composition & Media Formats */}
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <CardTitle className="text-white text-base font-bold font-sora flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#C3143D]" />
                <span>Media Formats & Inquiries Breakdown</span>
              </CardTitle>
              <CardDescription className="text-white/50 text-xs mt-0.5">
                Breakdown of video vs photo showcases & inquiry status
              </CardDescription>
            </div>
            <Link href="/admin/portfolio" className="text-xs text-[#C3143D] hover:underline">
              Add Project
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            
            {/* Media Type Breakdown Bar */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-white/60 font-medium">Showcase Formats (Video vs Photo)</span>
                <span className="text-white font-mono">
                  {totalProjects > 0 ? Math.round((videoProjects / totalProjects) * 100) : 0}% Video
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#C3143D] h-full transition-all duration-500" 
                  style={{ width: `${totalProjects > 0 ? (videoProjects / totalProjects) * 100 : 0}%` }}
                  title={`${videoProjects} Videos`}
                />
                <div 
                  className="bg-zinc-600 h-full transition-all duration-500" 
                  style={{ width: `${totalProjects > 0 ? (imageProjects / totalProjects) * 100 : 0}%` }}
                  title={`${imageProjects} Photos`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/50 mt-1.5 font-mono">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-[#C3143D]" />
                  <span>{videoProjects} Video Projects</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3 text-zinc-400" />
                  <span>{imageProjects} Photo Projects</span>
                </span>
              </div>
            </div>

            {/* Inquiries Processing Progress */}
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-white/60 font-medium">Client Inquiries Handled</span>
                <span className="text-white font-mono">
                  {totalInquiries > 0 ? Math.round((readInquiries / totalInquiries) * 100) : 0}% Read
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${totalInquiries > 0 ? (readInquiries / totalInquiries) * 100 : 0}%` }}
                  title={`${readInquiries} Read`}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${totalInquiries > 0 ? (unreadInquiries / totalInquiries) * 100 : 0}%` }}
                  title={`${unreadInquiries} New`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/50 mt-1.5 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{readInquiries} Handled</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{unreadInquiries} New Requests</span>
                </span>
              </div>
            </div>

            {/* Summary statistics grid */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-white/40 uppercase">Total Showcases</div>
                <div className="text-xs font-bold text-white mt-0.5">{totalProjects}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-white/40 uppercase">Total Categories</div>
                <div className="text-xs font-bold text-white mt-0.5">{totalCategories}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-white/40 uppercase">Total Services</div>
                <div className="text-xs font-bold text-white mt-0.5">{totalServices}</div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ── 3. REAL RECENT PORTFOLIO PROJECTS (DIRECT FROM DB) ── */}
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <CardTitle className="text-white text-base font-bold font-sora">
              Latest Portfolio Showcases
            </CardTitle>
            <CardDescription className="text-white/50 text-xs mt-0.5">
              The latest items saved in your portfolio database
            </CardDescription>
          </div>
          <Link href="/admin/portfolio">
            <Button variant="outline" size="sm" className="border-white/15 bg-transparent hover:bg-white/10 text-white text-xs h-8">
              <span>Manage Portfolio ({totalProjects})</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          {portfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolios.slice(0, 3).map((project) => (
                <div 
                  key={project.id}
                  className="rounded-xl p-3 bg-white/[0.02] border border-white/10 hover:border-[#C3143D]/50 transition-all duration-200 group"
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/60 relative mb-3 border border-white/5">
                    {project.thumbnailUrl ? (
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.captionEn || "Project"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        {project.thumbnailType === MediaType.Video ? (
                          <Video className="w-8 h-8 text-[#C3143D]/40" />
                        ) : (
                          <ImageIcon className="w-8 h-8" />
                        )}
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="text-[10px] bg-black/70 border-white/20 text-white backdrop-blur-md">
                        {project.thumbnailType === MediaType.Video ? "Video" : "Photo"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-white font-semibold text-xs truncate group-hover:text-[#F04F6A] transition-colors">
                      {project.captionEn || project.captionAr || "Untitled Showcase"}
                    </h3>
                    <p className="text-white/40 text-[11px] truncate">
                      Category: {project.categoryNameEn || project.categoryNameAr || "General"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-white/40 text-xs">
              <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-2" />
              <p>No projects in the database yet.</p>
              <Link href="/admin/portfolio" className="inline-block mt-2 text-[#C3143D] hover:underline font-medium">
                + Add your first showcase →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 4. REAL RECENT CLIENT INQUIRIES (DIRECT FROM DB) ── */}
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <CardTitle className="text-white text-base font-bold font-sora">
              Recent Contact Inquiries
            </CardTitle>
            <CardDescription className="text-white/50 text-xs mt-0.5">
              Live inquiries received from the website contact form
            </CardDescription>
          </div>
          <Link href="/admin/contact-requests">
            <Button size="sm" className="bg-[#C3143D] hover:bg-[#a81033] text-white text-xs h-8 gap-1 cursor-pointer">
              <span>All Inquiries ({totalInquiries})</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          {contactRequests.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {contactRequests.slice(0, 5).map((req) => (
                <div 
                  key={req.id} 
                  className="py-3 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#C3143D]/20 border border-[#C3143D]/40 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(req.name || "C")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {req.name || "Direct Client"}
                        </span>
                        {!req.isRead && (
                          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 truncate max-w-md">
                        {req.message || req.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-white/40 font-mono hidden sm:inline">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
                    </span>
                    <Link href="/admin/contact-requests">
                      <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white h-7 px-2">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-white/40 text-xs">
              <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p>No client inquiries received yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
