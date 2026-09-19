"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  // Mocking notifications until backend integration
  const notifications: any[] = []
  const unreadCount = 0

  const handleLogout = () => {
    // Logout logic will be implemented in Phase 5
    router.push("/admin/login")
  }

  const markAllNotificationsRead = () => {}

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center justify-center md:justify-start">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search..."
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:ring-red-600"
            />
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-white/10 text-white">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsRead}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.read ? "bg-white/5" : ""
                      }`}
                    >
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-white/60 mt-1">{notification.message}</p>
                      <span className="text-[10px] text-white/40 mt-2 block">{notification.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/40 text-sm">No new notifications</div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-2 py-1.5 hover:bg-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-white/60">admin@revo.agency</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/60 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-600/10 focus:text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
