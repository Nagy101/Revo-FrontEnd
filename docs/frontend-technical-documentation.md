# REVO Agency - Frontend Technical Documentation

## Project Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Theme**: Custom dark theme with REVO crimson branding

### Project Structure
\`\`\`
revo-agency/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Main website routes
│   ├── admin/                    # Admin dashboard routes
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── ClientLayout.tsx          # Client-side layout wrapper
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── sections/                 # Page sections
│   ├── admin/                    # Admin-specific components
│   ├── blog/                     # Blog components
│   ├── calendar/                 # Calendar components
│   └── navigation.tsx            # Main navigation
├── contexts/                     # React Context providers
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
\`\`\`

## Core Components Documentation

### 1. Navigation System (`components/navigation.tsx`)

**Purpose**: Main navigation bar with responsive design and auto-logout functionality.

**Key Features**:
- Responsive design (desktop/mobile layouts)
- GSAP animations for smooth interactions
- Auto-logout when leaving admin area
- Mobile hamburger menu with slide-in animation

**Props**: None (uses hooks for pathname and state)

**State Management**:
\`\`\`typescript
const [isScrolled, setIsScrolled] = useState(false)        // Scroll-based styling
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Mobile menu state
\`\`\`

**Responsive Breakpoints**:
- Desktop: `lg:flex` (≥1024px) - Full horizontal navigation
- Mobile: `lg:hidden` (<1024px) - Hamburger menu with overlay

**Auto-logout Logic**:
\`\`\`typescript
useEffect(() => {
  if (!pathname?.startsWith("/admin")) {
    const wasInAdmin = sessionStorage.getItem("was-in-admin") === "true"
    if (wasInAdmin) {
      localStorage.removeItem("admin-authenticated")
      sessionStorage.removeItem("was-in-admin")
    }
  }
}, [pathname])
\`\`\`

### 2. Layout System

#### Root Layout (`app/layout.tsx`)
**Purpose**: Provides global providers and metadata configuration.

**Providers Hierarchy**:
\`\`\`typescript
<ThemeProvider>
  <GSAPProvider>
    <ClientLayout>
      {children}
    </ClientLayout>
  </GSAPProvider>
</ThemeProvider>
\`\`\`

#### Client Layout (`app/ClientLayout.tsx`)
**Purpose**: Handles client-side routing logic and conditional navigation rendering.

**Key Logic**:
- Detects admin routes and hides navigation
- Implements auto-logout functionality
- Provides UserProvider context

### 3. Context System

#### User Context (`contexts/user-context.tsx`)
**Purpose**: Manages user authentication, form submissions, and user interactions.

**State Management**:
\`\`\`typescript
interface UserContextType {
  // Authentication
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  
  // Forms
  submitContactForm: (data: ContactForm) => Promise<void>
  submitReservation: (data: ReservationForm) => Promise<void>
  subscribeNewsletter: (data: NewsletterSubscription) => Promise<void>
  
  // Blog Interactions
  toggleLike: (postId: string) => void
  toggleBookmark: (postId: string) => void
  
  // Preferences
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
}
\`\`\`

**Local Storage Integration**:
- Persists blog interactions
- Saves user preferences
- Maintains authentication state

#### Admin Context (`contexts/admin-context.tsx`)
**Purpose**: Manages admin dashboard data and operations.

**Key Features**:
- CRUD operations for projects, services, blog posts
- Statistics calculation
- Notification system
- Data export/import functionality

### 4. Animation System

#### GSAP Integration (`lib/gsap.ts`, `components/gsap-provider.tsx`)
**Purpose**: Provides smooth animations throughout the application.

**Key Animations**:
- Navigation entrance animations
- Mobile menu slide-in effects
- Page transition animations
- Scroll-triggered animations

**Usage Example**:
\`\`\`typescript
useEffect(() => {
  gsap.fromTo(
    ".nav-item",
    { y: -20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.5,
    },
  )
}, [])
\`\`\`

### 5. Styling System

#### Tailwind Configuration (`tailwind.config.ts`)
**Custom Theme**:
\`\`\`typescript
theme: {
  extend: {
    colors: {
      primary: "#C3143D",      // REVO Crimson
      secondary: "#F04F6A",    // Light Crimson
      // ... other custom colors
    },
    fontFamily: {
      inter: ["var(--font-inter)"],
      sora: ["var(--font-sora)"],
    }
  }
}
\`\`\`

#### Global Styles (`app/globals.css`)
**Key Features**:
- Custom CSS variables for theming
- Gradient text utilities
- Button styling with hover effects
- Cursor behavior normalization
- Responsive typography

### 6. Type System (`types/`)

#### Core Types:
\`\`\`typescript
// Admin Types
interface AdminProject {
  id: string
  title: string
  description: string
  client: string
  status: "draft" | "in-progress" | "completed" | "archived"
  featured: boolean
  // ... other properties
}

// Blog Types
interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  status: "draft" | "published" | "archived"
  // ... other properties
}

// Calendar Types
interface CalendarDay {
  date: Date
  status: CalendarStatus
  sessions?: BookingSession[]
  events?: CalendarEvent[]
  // ... other properties
}
\`\`\`

## Page Structure Documentation

### 1. Homepage (`app/page.tsx`)
**Sections**:
- Hero section with GSAP animations
- Featured projects showcase
- Services overview
- Client testimonials
- Call-to-action section

### 2. Admin Dashboard (`app/admin/`)
**Structure**:
\`\`\`
admin/
├── layout.tsx              # Admin-specific layout
├── page.tsx                # Dashboard overview
├── portfolio/page.tsx      # Portfolio management
├── services/page.tsx       # Services management
├── calendar/page.tsx       # Calendar management
├── blog/page.tsx          # Blog management
└── auth/page.tsx          # Authentication page
\`\`\`

**Authentication Flow**:
1. User accesses `/admin`
2. Redirected to `/admin/auth` if not authenticated
3. Login form validates credentials
4. Sets `admin-authenticated` in localStorage
5. Redirects to admin dashboard

### 3. Blog System (`app/blog/`)
**Features**:
- Dynamic routing with `[slug]` parameter
- Category filtering
- Search functionality
- Like/bookmark interactions
- Responsive card layouts

### 4. Calendar System (`app/calendar/`)
**Components**:
- Interactive calendar grid
- Booking form integration
- Availability checking
- Reservation management

## State Management Patterns

### 1. Local State (useState)
Used for component-specific state like form inputs, modal visibility, loading states.

### 2. Context State (useContext)
Used for application-wide state like user authentication, admin data, preferences.

### 3. Local Storage Integration
\`\`\`typescript
// Save to localStorage
useEffect(() => {
  localStorage.setItem("blog-interactions", JSON.stringify(blogInteractions))
}, [blogInteractions])

// Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem("blog-interactions")
  if (saved) {
    setBlogInteractions(JSON.parse(saved))
  }
}, [])
\`\`\`

## Performance Optimizations

### 1. Code Splitting
- Automatic route-based code splitting with Next.js
- Dynamic imports for heavy components
- Lazy loading for images and animations

### 2. Image Optimization
- Next.js Image component with automatic optimization
- Placeholder images with proper dimensions
- WebP format support

### 3. Animation Performance
- GSAP for hardware-accelerated animations
- RequestAnimationFrame for smooth scrolling
- Debounced scroll handlers

### 4. Bundle Optimization
- Tree shaking for unused code
- Optimized imports from libraries
- Minimal bundle size with Next.js optimization

## Development Workflow

### 1. Component Development
\`\`\`typescript
// Component structure template
"use client" // If client-side features needed

import { useState, useEffect } from "react"
import { ComponentProps } from "@/types"

interface Props {
  // Define props interface
}

export function ComponentName({ prop1, prop2 }: Props) {
  // State management
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [])
  
  // Event handlers
  const handleEvent = () => {
    // Handle events
  }
  
  // Render
  return (
    <div className="responsive-classes">
      {/* Component JSX */}
    </div>
  )
}
\`\`\`

### 2. Styling Guidelines
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use custom CSS variables for theming
- Maintain consistent spacing scale

### 3. Animation Guidelines
- Use GSAP for complex animations
- CSS transitions for simple hover effects
- Respect user's motion preferences
- Optimize for 60fps performance

## Testing Considerations

### 1. Component Testing
- Test user interactions
- Verify responsive behavior
- Check accessibility features
- Validate form submissions

### 2. Integration Testing
- Test context providers
- Verify routing behavior
- Check authentication flows
- Test API integrations

### 3. Performance Testing
- Monitor bundle sizes
- Check animation performance
- Test on various devices
- Verify loading times

## Deployment Configuration

### 1. Environment Variables
\`\`\`env
NEXT_PUBLIC_API_URL=https://api.revo-agency.com
NEXT_PUBLIC_SITE_URL=https://revo-agency.com
\`\`\`

### 2. Build Configuration
- Static generation for marketing pages
- Server-side rendering for dynamic content
- API routes for backend integration
- Optimized asset handling

This documentation provides a comprehensive overview of the REVO Agency frontend codebase, enabling developers to understand, maintain, and extend the application effectively.
