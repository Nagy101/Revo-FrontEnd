# Implementation Plan: REVO Demo Productionization

**Branch**: `[001-revo-productionization]` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-revo-productionization/spec.md`

## Summary

Productionize the existing REVO agency website demo into a fast, secure, and accessible Next.js App Router application backed by an ASP.NET Core API. The existing visual identity (cinematic dark aesthetic, GSAP animations, noise texture, ambient effects) will be strictly preserved and optimized. A robust Mock API adapter strategy will be used during development, seamlessly swapping to the ASP.NET Core API for production.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+

**Primary Dependencies**: Next.js 15.x, Tailwind CSS, GSAP, React Hook Form, Zod, TanStack Query, next-intl.

**Storage**: SQL Server via ASP.NET Core Backend (Frontend manages no direct storage, only API calls)

**Testing**: Vitest, React Testing Library, Playwright

**Target Platform**: Web (Mobile-first, Responsive)

**Project Type**: Next.js Web Application Frontend

**Performance Goals**: LCP < 2.5s on mobile 4G, ~60fps animations. Eliminate unoptimized images, unnecessary global mousemove work, excessive background animation, and layout shift.

**Constraints**: Backend handles all auth/authz; secure HttpOnly cookies for production; Cloudinary for images, Vimeo for videos. Do not invent endpoints—treat contracts as provisional. `app/api` routes are forbidden unless a specific BFF requirement emerges.

**Scale/Scope**: Agency portfolio, 3 admins. Explicit separation between public and admin features.

## Constitution Check

*GATE: Passed*
- **Visual Identity**: Check. GSAP, noise texture, ambient effects, and design tokens strictly preserved and optimized.
- **Frontend Architecture**: Check. Next.js 15.x App Router, Server Components by default. Mock vs Real API separated by adapter layer.
- **Backend Integration**: Check. TanStack Query and dedicated feature service adapters.
- **Security**: Check. HttpOnly cookies for production, no client-side secret exposure.
- **Media**: Check. Cloudinary + deferred Vimeo.
- **Scope**: Check. Only requested features included.

## Project Structure

### Documentation (this feature)

```text
specs/001-revo-productionization/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code Architecture (Strict Feature-Based)

```text
app/
├── (public)/             # Public route entry points (thin)
├── admin/                # Admin route entry points (thin)
├── globals.css
├── layout.tsx
└── ClientLayout.tsx

features/                 # Feature-oriented architecture (STRICT)
├── portfolio/            # Portfolio-related components, hooks, services, schemas, types
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── schemas/
│   └── types.ts
├── services/             # Services-related code
├── clients/              # Clients-related code
├── contact/              # Contact-related code
└── auth/                 # Authentication-related code

components/               # Genuinely shared infrastructure only
├── ui/                   # Reusable base UI (shadcn, etc)
├── layout/               # Shared layout wrappers
└── shared/               # Shared elements across features

lib/                      # Shared utilities
├── api/                  # Base HTTP client
├── adapters/             # API/Repository Adapters (Mock vs Real)
├── gsap/                 # Global animation utilities
├── i18n/                 # Localization config
└── utils/                # Shared helper functions

types/                    # Global types only (not feature-specific)
```

**Architecture Rules**:
- **Feature Colocation**: Code is colocated by feature (`portfolio`, `services`, `clients`, `contact`, `auth`) instead of scattered across global folders.
- **Thin Routes**: Next.js route files under `app/` act only as thin route entry points. Route-specific business/UI logic lives in the appropriate `features/` folder.
- **No Generic Global Folders**: Do not create generic global folders like `hooks/`, `services/`, or `schemas/` for feature-specific code.
- **Shared Code**: Code is only extracted to `components/` or `lib/` when genuinely reused by multiple features. No duplicated feature logic.
- **Mock/Real Architecture**: The UI strictly calls Feature Services, which in turn use `lib/adapters` to switch between Mock and ASP.NET Core API based on `NEXT_PUBLIC_DATA_MODE`.
