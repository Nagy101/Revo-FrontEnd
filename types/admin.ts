// ============================================================================
// ADMIN TYPES & INTERFACES
// ============================================================================

export interface AdminStats {
  totalVisitors: number
  activeProjects: number
  todayVisitors: number
  weeklyGrowth: number
}

export interface AdminNotification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface AdminProject {
  id: string
  title: string
  description: string
  client: string
  status: "draft" | "in-progress" | "completed" | "archived"
  featured: boolean
  image: string
  tags: string[]
  startDate: Date
  endDate?: Date
  budget: number
}

export interface AdminService {
  id: string
  title: string
  description: string
  shortDescription: string
  price: number
  duration: number // in weeks
  features: string[]
  category: string
  active: boolean
  icon: string
  image: string
  createdAt: Date
  updatedAt: Date
}

// Legacy types for compatibility
export interface Project extends AdminProject {}
export interface Service extends AdminService {}
export interface Notification extends AdminNotification {}
