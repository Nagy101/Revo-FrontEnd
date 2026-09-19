# Phase 0: Research & Technical Decisions

## 1. Application Framework & Version
- **Decision**: Next.js 15.x App Router
- **Rationale**: Keeps the project aligned with the current 15.x configuration rather than downgrading. Provides Server Components by default and excellent code-splitting. No `app/api` routes will be used unless a strict BFF need is identified.

## 2. API Adapter & Mock Strategy
- **Decision**: Adapter Pattern for API calls (`UI → Feature Hooks → Feature Services → Adapter → Mock/Real`).
- **Rationale**: The ASP.NET Core backend is not ready. The frontend must be fully functional and testable using a Mock Adapter populated with realistic demo data (Categories, Portfolios, media, Services, Clients). UI components must have NO branching logic for mock vs. real data. `NEXT_PUBLIC_DATA_MODE=mock` will control this at the adapter level. Mock data/auth will never be shipped to production.

## 3. Visual Identity & Preservation
- **Decision**: Strictly preserve the existing REVO cinematic visual language.
- **Rationale**: The goal is to productionize, not redesign. GSAP animations, noise texture, ambient effects, gradient treatments, client marquee, and hover interactions must be preserved but optimized.

## 4. Performance Optimization specific to Demo Issues
- **Decision**: Systematic optimization of known demo performance bottlenecks.
- **Rationale**: To hit LCP < 2.5s and 60fps, we must specifically address:
  - Unoptimized images (will be migrated to Cloudinary/Next.js Image).
  - Unnecessary global mousemove listeners (will be debounced/removed if off-screen).
  - Excessive background and initial animations (will be deferred until after LCP).
  - Layout shifts and unused dependencies.

## 5. Server State Management
- **Decision**: TanStack Query
- **Rationale**: Handles caching, mutations, loading states, and refetching. 

## 6. Form Handling & Validation
- **Decision**: React Hook Form with Zod
- **Rationale**: Performant client-side validation that mirrors backend requirements.

## 7. Admin Content Management Planning
- **Decision**: Full CRUD + Publish + Ordering workflows for admins.
- **Rationale**: Admins need to perform list/read, create, update, delete, publish/unpublish, manual ordering, and complex media management (uploading images/videos with order for portfolios). The mock data adapters must fully simulate these workflows.

## 8. Authentication
- **Decision**: ASP.NET Core HttpOnly cookies (Production) / Local Mock Auth (Development).
- **Rationale**: Production must use the authoritative backend security. Mock auth is strictly for enabling local development until the API is ready.
  **CRITICAL SECURITY CONSTRAINT**: Mock authentication MUST NOT store authentication tokens, passwords, or session secrets in `localStorage` or `sessionStorage`, even in development. It must be strictly isolated from production authentication and implemented in a way (e.g., compile-time exclusions or hard environment checks) that guarantees it cannot accidentally be enabled in production.

## 9. Localization
- **Decision**: `next-intl`
- **Rationale**: English (default) and Arabic (RTL) support.
