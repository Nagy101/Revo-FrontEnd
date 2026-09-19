# Implementation Tasks: REVO Demo Productionization

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize/verify project structure per plan.md
- [x] T002 Ensure Next.js 15, Tailwind, GSAP, React Hook Form, Zod, TanStack Query, next-intl are configured in `package.json`

---

## Phase 2: Codebase Audit & Cleanup (Pre-Implementation)

**Purpose**: Clean up the existing demo codebase by removing out-of-scope features and dead code before implementing the production architecture. Ensure the REVO visual identity is preserved during cleanup.

- [x] T003 Audit `package.json` and remove unused dependencies
- [x] T004 Audit and remove unused React components across `components/`
- [x] T005 Audit `components/ui/` and remove unused shadcn/ui components
- [x] T006 Remove out-of-scope Blog-related routes, components, data, types, and assets from `app/` and `components/`
- [x] T007 Remove out-of-scope Calendar-related routes, components, data, types, and assets from `app/` and `components/`
- [x] T008 Remove out-of-scope Booking/reservation-related routes, components, data, types, and assets from `app/` and `components/`
- [x] T009 Audit and remove unused hooks across `hooks/` and `contexts/`
- [x] T010 Audit and remove unused animation utilities from `lib/gsap/` or `lib/utils.ts`
- [x] T011 Audit Lottie payloads and remove unused/heavy payloads from `public/` while preserving approved visuals
- [x] T012 Audit and remove unused video components and video assets from `components/` and `public/`
- [x] T013 Remove duplicate utilities and dead code from `lib/`
- [x] T014 Remove dead CSS and obsolete styles from `app/globals.css` and styling files
- [x] T015 Remove demo `localStorage`/`sessionStorage` authentication logic from `contexts/` or `hooks/`
- [x] T016 Remove hardcoded demo/admin credentials from all source files
- [x] T017 Audit `next.config.mjs` and remove build-check bypasses (`eslint.ignoreDuringBuilds`, `typescript.ignoreBuildErrors`)
- [x] T018 Ensure `tsconfig.json` is set to strict mode to fail production builds on errors
- [x] T019 Optimize all global mousemove-driven visual effects (CustomCursor, AmbientLight, etc.) using `requestAnimationFrame` or an appropriate throttling strategy (do not assume standard debounce) in `components/ui/`
- [x] T020 Audit and defer heavy initial animations and background effects to prioritize LCP across all relevant public routes and initial visual effects (not just the homepage)
- [x] T021 Audit image loading, placeholder usage, and CLS prevention strategies across all public routes
- [x] T022 Perform early bundle analysis during cleanup using `@next/bundle-analyzer` to identify and remove large unused client-side dependencies
- [x] T023 QA Checkpoint: Verify cinematic dark aesthetic, crimson branding, noise texture, ambient lighting, gradients, reveal animations, client marquee, hover interactions, and approved GSAP animations are perfectly preserved after cleanup.

---

## Phase 3: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure covering the agreed architecture. No user story work can begin until this phase is complete.

- [x] T024 Setup `NEXT_PUBLIC_DATA_MODE` environment toggle and basic `ApiAdapter` interface in `lib/adapters/api-interface.ts`
- [x] T025 [P] Create mock API data store (in-memory realistic data) in `lib/adapters/mock-data.ts`
- [x] T026 [P] Create HTTP client for production ASP.NET Core backend calls in `lib/api/http-client.ts`
- [x] T027 [P] Define Provisional Domain Types (Portfolio, Category, Service, Client, ContactRequest, Settings) in `types/index.ts`
- [x] T028 [P] Configure TanStack Query provider in `app/layout.tsx` (Application data infrastructure)
- [x] T029 Create universal Error Boundary and loading states in `app/error.tsx` and `app/loading.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 4: User Story 1 - Public Website Browsing (Priority: P1) 🏆 MVP

**Goal**: Browse the REVO website with a cinematic, fast, and accessible experience preserving the existing visual identity.

### Implementation for User Story 1

- [x] T030 [P] [US1] Implement mock and real services for provisional public endpoints in `features/portfolio/services/`, `features/services/services/`, `features/clients/services/`
- [x] T031 [P] [US1] Create Public hooks using TanStack Query in `features/portfolio/hooks/`, `features/services/hooks/`, `features/clients/hooks/`
- [ ] T032 [US1] Build/Optimize Homepage preserving REVO visuals in `app/(public)/page.tsx`
- [ ] T033 [US1] Build About page in `app/(public)/about/page.tsx`
- [ ] T034 [US1] Build Services page in `app/(public)/services/page.tsx` (Logic/UI in `features/services/components/`)
- [ ] T035 [US1] Build Portfolio Listing page using Cloudinary optimized images in `app/(public)/portfolio/page.tsx` (Logic/UI in `features/portfolio/components/`)
- [ ] T036 [US1] Build Portfolio Detail page with deferred Vimeo players and dynamic SEO metadata in `app/(public)/portfolio/[slug-or-id]/page.tsx` (Route parameter `[slug]` vs `[id]` is dependent on confirmed API contract)
- [ ] T037 [US1] Build Clients marquee/page in `app/(public)/clients/page.tsx` (Logic/UI in `features/clients/components/`)
- [ ] T038 [US1] Ensure all animations respect `prefers-reduced-motion` in `lib/gsap/animations.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 5: User Story 2 - Secure Admin Authentication (Priority: P1)

**Goal**: Securely log in to the admin dashboard using ASP.NET Core backend-managed HttpOnly cookies.

### Implementation for User Story 2

- [ ] T039 [P] [US2] Implement auth API services (mock vs real HttpOnly) in `features/auth/services/auth.service.ts`
- [ ] T040 [P] [US2] Create auth context/store for frontend session state (NO token storage) in `features/auth/hooks/useAuth.ts`
- [ ] T041 [US2] Build Admin Login page with React Hook Form + Zod in `app/admin/login/page.tsx` (Form/schema in `features/auth/components/` and `features/auth/schemas/`)
- [ ] T042 [US2] Implement Admin route protection middleware in `middleware.ts` that only performs navigation/session gating using the provisional backend contract (backend authorization remains authoritative)
- [ ] T043 [US2] Build Admin Dashboard shell with logout functionality in `app/admin/layout.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 6: User Story 3 - Content Management (Priority: P1)

**Goal**: Manage Portfolios, Categories, Services, Clients, and Contact Requests through the dashboard.

### Implementation for User Story 3

- [ ] T044 [P] [US3] Implement admin CRUD provisional API services and schemas in respective feature folders (`features/portfolio/services/`, etc.)
- [ ] T045 [P] [US3] Implement optimistic concurrency 409 conflict detection and recovery flow in `lib/api/error-handler.ts`
- [ ] T046 [US3] Build generic admin data table/list UI in `components/admin/DataTable.tsx`
- [ ] T047 [US3] Build Categories CRUD (List/Edit) in `app/admin/categories/page.tsx` (Logic in `features/portfolio/`)
- [ ] T048 [US3] Build Portfolios CRUD (List/Edit, Media Management, Order, Publish) in `app/admin/portfolios/page.tsx` (Logic in `features/portfolio/`)
- [ ] T049 [US3] Build Services CRUD (List/Edit, Bilingual Content) in `app/admin/services/page.tsx` (Logic in `features/services/`)
- [ ] T050 [US3] Build Clients CRUD (List/Edit, Non-bilingual name, Order) in `app/admin/clients/page.tsx` (Logic in `features/clients/`)
- [ ] T051 [US3] Build Settings Management (WhatsApp Number only) in `app/admin/settings/page.tsx` (Logic in `features/contact/`)

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 7: User Story 4 - Contact Flow Integration (Priority: P2)

**Goal**: Submit a contact inquiry reliably with backend persistence and anti-spam verification before opening WhatsApp.

### Implementation for User Story 4

- [ ] T052 [P] [US4] Implement provisional contact submission services and schemas (mock vs real) in `features/contact/services/` and `features/contact/schemas/`
- [ ] T053 [P] [US4] Implement backend failure handling (no WhatsApp redirect on 5xx, preserve data) in `features/contact/hooks/useContactSubmit.ts`
- [ ] T054 [US4] Build Contact form using React Hook Form + Zod + anti-spam in `app/(public)/contact/page.tsx` (Logic in `features/contact/components/`)
- [ ] T055 [US4] Build Contact Requests admin viewer in `app/admin/contact/page.tsx` (Logic in `features/contact/components/`)

---

## Phase 8: User Story 5 - Arabic Localization (Priority: P2)

**Goal**: View the website in Arabic with proper RTL layout and next-intl.

### Implementation for User Story 5

- [ ] T056 [P] [US5] Configure `next-intl` plugin and routing in `next.config.mjs` and `middleware.ts`
- [ ] T057 [P] [US5] Create base en/ar translation dictionaries in `messages/en.json` and `messages/ar.json`
- [ ] T058 [US5] Implement RTL layout toggle and locale provider in `app/layout.tsx`
- [ ] T059 [US5] Create Language Switcher component in `components/navigation/LanguageSwitcher.tsx`
- [ ] T060 [US5] Audit all public pages and adjust layouts/animations to be RTL-aware without horizontal overflow in `app/(public)/` and `components/sections/`

---

## Phase 9: Polish / QA (Final Phase)

**Purpose**: Production build, QA validation, and performance verification.

- [ ] T061 [P] Run production build to ensure TypeScript and ESLint strict validation passes
- [ ] T062 Perform Browser Visual QA to ensure cinematic dark aesthetic, noise texture, and GSAP animations match baseline
- [ ] T063 Perform Responsive QA across mobile, tablet, and desktop viewports
- [ ] T064 Perform RTL QA to verify Arabic rendering and animation directionality
- [ ] T065 Verify `prefers-reduced-motion` compliance
- [ ] T066 Validate Core Web Vitals (LCP < 2.5s, CLS near zero) using Lighthouse
- [ ] T067 Validate Security: Ensure HttpOnly cookies, no leaked secrets, and unauthorized access rejection
- [ ] T068 Validate Contact Flow: Simulate 500 error to ensure no WhatsApp redirect and form preservation
- [ ] T069 Perform final production bundle verification using `@next/bundle-analyzer` to ensure no unexpected large dependencies shipped
- [ ] T070 Run `quickstart.md` validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Codebase Audit & Cleanup (Phase 2)**: Depends on Setup completion
- **Foundational (Phase 3)**: Depends on Codebase Audit - BLOCKS all user stories
- **User Stories (Phase 4+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel
  - Or sequentially in priority order (P1 → P2)
- **Polish / QA (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 3)
- **US2 (P1)**: Can start after Foundational (Phase 3)
- **US3 (P1)**: Depends on US2 (needs Auth)
- **US4 (P2)**: Public contact flow depends on US1 infrastructure. Admin Contact Requests viewer depends on US2/US3 (Admin/Auth) infrastructure.
- **US5 (P2)**: Can start after US1

### Parallel Opportunities

- All tasks marked [P] can run in parallel within their respective phases.
- Once Foundational phase completes, US1 and US2 can start in parallel.
- Feature hooks in US1 (T031) can be developed in parallel.

---

## Parallel Example: Foundational Phase

```bash
# Launch Foundational setup tasks together:
Task: "Create mock API data store (in-memory realistic data) in lib/adapters/mock-data.ts"
Task: "Create HTTP client for production ASP.NET Core backend calls in lib/api/http-client.ts"
Task: "Define Provisional Domain Types (Portfolio, Category, Service, Client, ContactRequest, Settings) in types/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Codebase Audit & Cleanup (Crucial step)
3. Complete Phase 3: Foundational (CRITICAL - blocks all stories)
4. Complete Phase 4: User Story 1
5. **STOP and VALIDATE**: Test User Story 1 independently using `NEXT_PUBLIC_DATA_MODE=mock`.
6. The public facing site is now visually complete and performant.

### Incremental Delivery

1. Complete Setup + Audit + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Public Demo (MVP!)
3. Add User Story 2 → Secure Admin Login complete
4. Add User Story 3 → Admin CMS is functional (via Mock Adapter)
5. Add User Story 4 & 5 → Form submissions and RTL work
6. Complete Phase 9 Polish & QA

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Do NOT invent API endpoints, authentication flows, or contracts. Where unavailable, depend on provisional interfaces.
- Verify feature via `quickstart.md` after completion
- Stop at any checkpoint to validate story independently
