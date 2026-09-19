"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Video, PenTool, SearchIcon, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminServices, useCreateService, useUpdateService, useDeleteService } from "@/features/services/hooks/useServices"
import type { Service } from "@/types/index"

// Dynamic icon resolver for display
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Video': return <Video className="h-6 w-6" />
    case 'PenTool': return <PenTool className="h-6 w-6" />
    case 'Search': return <SearchIcon className="h-6 w-6" />
    default: return <ImageIcon className="h-6 w-6" />
  }
}

export function ServicesManager() {
  const { data: services = [], isLoading } = useAdminServices()
  
  const createMutation = useCreateService()
  const updateMutation = useUpdateService()
  const deleteMutation = useDeleteService()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const filteredServices = services.filter((service) => 
    service.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    createMutation.mutate({
      titleEn: formData.get("titleEn") as string,
      slug: (formData.get("titleEn") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      descriptionEn: formData.get("descriptionEn") as string,
      icon: formData.get("icon") as string,
      order: Number(formData.get("order") || services.length + 1),
      isPublished: formData.get("isPublished") === "on",
    }, {
      onSuccess: () => setIsCreateModalOpen(false)
    })
  }

  const handleEditService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingService) return
    const formData = new FormData(e.currentTarget)
    
    updateMutation.mutate({
      id: editingService.id,
      data: {
        titleEn: formData.get("titleEn") as string,
        descriptionEn: formData.get("descriptionEn") as string,
        icon: formData.get("icon") as string,
        order: Number(formData.get("order")),
        isPublished: formData.get("isPublished") === "on",
      }
    }, {
      onSuccess: () => setEditingService(null)
    })
  }

  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id)
    }
  }

  const togglePublished = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({
      id,
      data: { isPublished: !currentStatus }
    })
  }

  const ServiceForm = ({ service, onSubmit, onCancel }: { service?: Service | null, onSubmit: any, onCancel: any }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="titleEn">Service Title (English)</Label>
        <Input id="titleEn" name="titleEn" defaultValue={service?.titleEn} placeholder="e.g. Video Production" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionEn">Description (English)</Label>
        <Textarea
          id="descriptionEn"
          name="descriptionEn"
          defaultValue={service?.descriptionEn}
          placeholder="Service description..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name</Label>
          <Select name="icon" defaultValue={service?.icon || "Video"}>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="PenTool">PenTool (Design)</SelectItem>
              <SelectItem value="Search">Search (SEO/Marketing)</SelectItem>
              <SelectItem value="Image">Image (Photography)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Sort Order</Label>
          <Input id="order" name="order" type="number" defaultValue={service?.order || services.length + 1} required />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPublished" name="isPublished" defaultChecked={service ? service.isPublished : true} />
        <Label htmlFor="isPublished">Published to Live Site</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={createMutation.isPending || updateMutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={createMutation.isPending || updateMutation.isPending}>
          {service ? "Update Service" : "Create Service"}
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-sora">Services Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage your agency's service offerings and details.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-black border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm onSubmit={handleCreateService} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-white/10 backdrop-blur">
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search services by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="bg-black/50 border-white/10 overflow-hidden group hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/20 rounded-lg text-primary">
                  {getIconComponent(service.icon)}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10 text-white/70"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl bg-black border border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle>Edit Service: {service.titleEn}</DialogTitle>
                      </DialogHeader>
                      <ServiceForm
                        service={service}
                        onSubmit={handleEditService}
                        onCancel={() => setEditingService(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-500/20 text-white/70 hover:text-red-400"
                    onClick={() => handleDeleteService(service.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl text-white mb-2 truncate" title={service.titleEn}>
                  {service.titleEn}
                </h3>
                <p className="text-sm text-white/60 line-clamp-3 mb-6">
                  {service.descriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Badge className={service.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                  {service.isPublished ? "Published" : "Draft"}
                </Badge>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`publish-${service.id}`} className="text-xs text-white/50 cursor-pointer">
                    {service.isPublished ? "Live" : "Hidden"}
                  </Label>
                  <Switch
                    id={`publish-${service.id}`}
                    checked={service.isPublished}
                    onCheckedChange={() => togglePublished(service.id, service.isPublished)}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/50 border border-dashed border-white/10 rounded-lg">
            No services found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
