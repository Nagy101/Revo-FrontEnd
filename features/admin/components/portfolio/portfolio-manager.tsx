"use client"

import { useState } from "react"
import { Search, Plus, Eye, Edit, Trash2, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAdminPortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from "@/features/portfolio/hooks/usePortfolios"
import { useCategories } from "@/features/categories/hooks/useCategories"
import type { Portfolio } from "@/types/index"

export function PortfolioManager() {
  const { data: portfolios = [], isLoading } = useAdminPortfolios()
  const { data: categoriesResponse } = useCategories()
  
  const categories = categoriesResponse?.data?.data || []
  
  const createMutation = useCreatePortfolio()
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Portfolio | null>(null)

  const filteredProjects = portfolios.filter((project) => {
    const matchesSearch = project.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    createMutation.mutate({
      titleEn: formData.get("titleEn") as string,
      slug: (formData.get("titleEn") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      descriptionEn: formData.get("descriptionEn") as string,
      clientName: formData.get("clientName") as string,
      categoryId: formData.get("categoryId") as string,
      mediaUrl: (formData.get("mediaUrl") as string) || "/placeholder.svg?height=800&width=600",
      mediaType: formData.get("mediaType") as "image" | "video",
      order: Number(formData.get("order") || portfolios.length + 1),
      isPublished: formData.get("isPublished") === "on",
    }, {
      onSuccess: () => setIsCreateModalOpen(false)
    })
  }

  const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProject) return
    const formData = new FormData(e.currentTarget)
    
    updateMutation.mutate({
      id: editingProject.id,
      data: {
        titleEn: formData.get("titleEn") as string,
        descriptionEn: formData.get("descriptionEn") as string,
        clientName: formData.get("clientName") as string,
        categoryId: formData.get("categoryId") as string,
        mediaUrl: formData.get("mediaUrl") as string,
        mediaType: formData.get("mediaType") as "image" | "video",
        order: Number(formData.get("order")),
        isPublished: formData.get("isPublished") === "on",
      }
    }, {
      onSuccess: () => setEditingProject(null)
    })
  }

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id)
    }
  }

  const togglePublished = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({
      id,
      data: { isPublished: !currentStatus }
    })
  }

  const ProjectForm = ({ project, onSubmit, onCancel }: { project?: Portfolio | null, onSubmit: any, onCancel: any }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titleEn">Project Title</Label>
          <Input id="titleEn" name="titleEn" defaultValue={project?.titleEn} placeholder="Enter project title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input id="clientName" name="clientName" defaultValue={project?.clientName} placeholder="Client name" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionEn">Description</Label>
        <Textarea
          id="descriptionEn"
          name="descriptionEn"
          defaultValue={project?.descriptionEn}
          placeholder="Project description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={project?.categoryId || categories[0]?.id}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.nameEn}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mediaType">Media Type</Label>
          <Select name="mediaType" defaultValue={project?.mediaType || "image"}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video (Vimeo ID)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mediaUrl">Media URL / Vimeo ID</Label>
          <Input
            id="mediaUrl"
            name="mediaUrl"
            defaultValue={project?.mediaUrl}
            placeholder="/placeholder.svg or 123456789"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Sort Order</Label>
          <Input id="order" name="order" type="number" defaultValue={project?.order || portfolios.length + 1} required />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPublished" name="isPublished" defaultChecked={project ? project.isPublished : true} />
        <Label htmlFor="isPublished">Published to Live Site</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={createMutation.isPending || updateMutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={createMutation.isPending || updateMutation.isPending}>
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sora tracking-tight text-white">Portfolio Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage your portfolio projects and showcase your work.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-black border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreateProject} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-white/10 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search projects by title or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nameEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const category = categories.find(c => c.id === project.categoryId)
          return (
            <Card key={project.id} className="bg-black/50 border-white/10 overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="relative aspect-video bg-zinc-900">
                {project.mediaType === "image" ? (
                  <img
                    src={project.mediaUrl}
                    alt={project.titleEn}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Video (Vimeo)</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge className={project.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                    {project.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 truncate" title={project.titleEn}>
                      {project.titleEn}
                    </h3>
                    <p className="text-sm text-white/50">{project.clientName}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog open={editingProject?.id === project.id} onOpenChange={(open) => !open && setEditingProject(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/10 text-white/70"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-black border border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Project: {project.titleEn}</DialogTitle>
                        </DialogHeader>
                        <ProjectForm
                          project={project}
                          onSubmit={handleEditProject}
                          onCancel={() => setEditingProject(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-500/20 text-white/70 hover:text-red-400"
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/40">{category?.nameEn || "Uncategorized"}</span>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`publish-${project.id}`} className="text-xs text-white/50 cursor-pointer">
                      {project.isPublished ? "Live" : "Hidden"}
                    </Label>
                    <Switch
                      id={`publish-${project.id}`}
                      checked={project.isPublished}
                      onCheckedChange={() => togglePublished(project.id, project.isPublished)}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/50 border border-dashed border-white/10 rounded-lg">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
