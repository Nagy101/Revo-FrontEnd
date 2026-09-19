<!-- Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Added sections: Replaced all principles with production-focused constraints. Added explicit out-of-scope constraints.
- Follow-up TODOs: None
-->
# REVO Agency Constitution

## Core Principles

### I. Visual Identity & Preservation
The existing REVO demo is the primary visual reference and MUST be preserved and productionized rather than visually replaced. Preserve its cinematic dark aesthetic, crimson branding, ambient effects, noise texture, cursor interactions, reveal animations, client marquee, Lottie service visuals, counters, hover states, and other intentional visual language where appropriate. Use centralized design tokens (Background #121212, Primary Crimson #C3143D, Secondary #F04F6A, Border #2C2C2C, Card #1A1A1A, Primary text #F0F0F0, White #FFFFFF) instead of scattering raw color values.

### II. Frontend Architecture
Use Next.js App Router, TypeScript strict mode, and React Server Components by default. Use Client Components only where interactivity requires them. Employ feature-oriented architecture and reusable components following practical SOLID principles. Avoid unnecessary abstractions and overengineering. Use React Hook Form with Zod for client-side form handling and schema validation.

### III. Backend Integration & Data Management
Next.js frontend communicates with an ASP.NET Core .NET API (backed by SQL Server) over HTTPS. The backend owns business rules, authorization, validation (which remains authoritative), persistence, and authentication. All API communication must be isolated behind a dedicated API/service layer—do not scatter fetch/axios calls throughout UI components or invent undefined endpoints. Use TanStack Query for server state, caching, mutations, loading/error states, and refetching. Do not use React Context for server-state management.

### IV. Authentication & Security
Admin authentication is handled by the ASP.NET Core backend. Prefer secure HttpOnly cookies for authenticated sessions. Do NOT store authentication tokens or credentials in `localStorage`/`sessionStorage`. Never expose secrets in client-side code. Frontend route protection is not a security boundary; backend authorization is authoritative. Follow secure input handling and least-privilege principles.

### V. Media & Localization
Images must use Cloudinary (or agreed external storage/CDN) instead of Next.js `public/` or .NET `wwwroot`. Videos are hosted on Vimeo; do not load Vimeo players unnecessarily on listing pages. English is the default language, and Arabic must be fully supported with proper RTL layout using `next-intl`. Localized UI must not cause horizontal overflow or broken layouts.

## Additional Constraints

### Animation, Performance & Quality
Animation is core to the REVO experience but must remain purposeful and performant. Use GSAP for complex existing animations and CSS transitions for simple interactions (prefer transform/opacity). Respect `prefers-reduced-motion` and avoid patterns that block rendering or delay LCP. Target excellent Core Web Vitals using optimized images, code splitting, dynamic imports, and minimal unnecessary JS. Do not disable TypeScript or lint/build safety checks to hide errors, and do not introduce hardcoded credentials or demo authentication in production.

### Accessibility & SEO
Use semantic HTML, support keyboard navigation, visible focus states, sufficient contrast, accessible form errors, and accessible labels. Use ARIA only when appropriate. Public pages must support proper metadata, Open Graph, canonical URLs, `robots.txt`, `sitemap`, and structured data. Portfolio detail pages require dynamic SEO metadata.

### Scope & Separation of Concerns
Public website and admin dashboard must remain clearly separated architecturally and in routing. The production scope includes Home, About, Services, Portfolio, Portfolio Detail, Clients, Contact, Admin Login, Admin Dashboard, Portfolio management, Category management, Services management, Clients management, Contact Requests, Settings, and Analytics. Explicitly OUT OF SCOPE: Blog, Calendar, Booking, Public user accounts, and Complex role/permission systems (there are three trusted admin accounts).

### Contact Flow & Analytics
Contact submissions must be persisted by the backend before the frontend redirects/opens WhatsApp (the number is managed via backend settings). If WhatsApp opening fails, the stored lead must remain persisted. Support internal analytics/KPI data and Google Analytics integration without exposing sensitive information.

### Testing
Use pragmatic testing focused on critical business behavior and integration. Use Vitest/React Testing Library where appropriate and Playwright for important end-to-end flows.

## Governance

This Constitution supersedes all other practices. Any proposed architectural change that conflicts with these principles must be explicitly justified before implementation. Do not silently replace established architecture or product scope.

**Version**: 2.0.0 | **Ratified**: 2026-09-16 | **Last Amended**: 2026-09-16
