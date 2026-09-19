"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAdminClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/features/clients/hooks/useClients"
import type { Client } from "@/types/index"

export function ClientsManager() {
  const { data: clients = [], isLoading } = useAdminClients()
  
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const deleteMutation = useDeleteClient()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    createMutation.mutate({
      name: formData.get("name") as string,
      logoUrl: (formData.get("logoUrl") as string) || "/placeholder.svg?height=100&width=200",
      order: Number(formData.get("order") || clients.length + 1)
    }, {
      onSuccess: () => setIsCreateModalOpen(false)
    })
  }

  const handleEditClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingClient) return
    const formData = new FormData(e.currentTarget)
    
    updateMutation.mutate({
      id: editingClient.id,
      data: {
        name: formData.get("name") as string,
        logoUrl: formData.get("logoUrl") as string,
        order: Number(formData.get("order")),
      }
    }, {
      onSuccess: () => setEditingClient(null)
    })
  }

  const handleDeleteClient = (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteMutation.mutate(id)
    }
  }

  const ClientForm = ({ client, onSubmit, onCancel }: { client?: Client | null, onSubmit: any, onCancel: any }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Client Name</Label>
        <Input id="name" name="name" defaultValue={client?.name} placeholder="e.g. Acme Corp" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          defaultValue={client?.logoUrl}
          placeholder="/images/client-logo.png"
        />
        <p className="text-xs text-white/50 mt-1">Provide a relative or absolute URL to the client's logo.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Sort Order</Label>
        <Input id="order" name="order" type="number" defaultValue={client?.order || clients.length + 1} required />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={createMutation.isPending || updateMutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={createMutation.isPending || updateMutation.isPending}>
          {client ? "Update Client" : "Add Client"}
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-sora">Clients Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage the clients displayed in your marquee and portfolio.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-black border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleCreateClient} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-white/10 backdrop-blur">
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search clients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-black/50 border-white/10 overflow-hidden group hover:border-primary/50 transition-colors relative">
            <CardContent className="p-4 flex flex-col items-center justify-center min-h-[140px]">
              <div className="h-12 w-auto mb-3 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=100&width=200";
                  }}
                />
              </div>
              <p className="text-xs font-medium text-white/70 truncate w-full text-center" title={client.name}>
                {client.name}
              </p>

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog open={editingClient?.id === client.id} onOpenChange={(open) => !open && setEditingClient(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-black/50 hover:bg-white/10 text-white"
                      onClick={() => setEditingClient(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-black border border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Edit Client: {client.name}</DialogTitle>
                    </DialogHeader>
                    <ClientForm
                      client={client}
                      onSubmit={handleEditClient}
                      onCancel={() => setEditingClient(null)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/50 hover:bg-red-500/20 text-white hover:text-red-400"
                  onClick={() => handleDeleteClient(client.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/50 border border-dashed border-white/10 rounded-lg">
            No clients found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
