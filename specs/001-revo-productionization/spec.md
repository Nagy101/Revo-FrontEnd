# Feature Specification: REVO Demo Productionization

**Feature Branch**: `[001-revo-productionization]`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Complete productionization of the existing REVO agency website demo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Website Browsing (Priority: P1)
As a public visitor, I want to browse the REVO website (Home, About, Services, Portfolio, Clients, Contact) with a cinematic, fast, and accessible experience so that I can evaluate the agency's work.

**Why this priority**: The public face of the agency is the core product and must retain the demo's visual identity while being production-ready.

**Independent Test**: Can be fully tested by navigating all public routes, verifying animations, performance metrics (LCP < 2.5s), and proper semantic HTML/accessibility without any admin backend dependencies.

**Acceptance Scenarios**:
1. **Given** a visitor on a mobile device, **When** they load the homepage, **Then** the page achieves an LCP under 2.5 seconds and renders smoothly without visual effects compromising initial performance.
2. **Given** a visitor navigating to the Portfolio listing, **When** the page loads, **Then** Vimeo video players are deferred and not loaded on listing cards, while images are loaded via optimized responsive Cloudinary assets.
3. **Given** a visitor with `prefers-reduced-motion` enabled, **When** they interact with the site, **Then** complex animations are disabled or simplified.

---

### User Story 2 - Secure Admin Authentication (Priority: P1)
As a trusted administrator, I want to securely log in to the admin dashboard using backend-managed credentials so that I can access content management features safely.

**Why this priority**: Security is paramount. Without secure authentication, content management cannot safely happen.

**Independent Test**: Can be fully tested by attempting login, verifying secure session persistence, and testing unauthorized access rejection.

**Acceptance Scenarios**:
1. **Given** an unauthenticated user, **When** they attempt to access the dashboard, **Then** they are redirected to the login page.
2. **Given** an admin providing valid credentials, **When** they submit the login form, **Then** the backend issues a secure HttpOnly cookie and they access the dashboard.
3. **Given** an authenticated admin, **When** they view local client storage, **Then** no authentication tokens, hardcoded production credentials, or demo credentials are found.

---

### User Story 3 - Content Management (Priority: P1)
As an administrator, I want to manage Portfolios, Categories, Services, Clients, and Contact Requests through the dashboard so that the public website stays up to date.

**Why this priority**: Core operational requirement for the agency.

**Independent Test**: Can be fully tested by performing CRUD operations in the admin dashboard and verifying data updates via the service layer.

**Acceptance Scenarios**:
1. **Given** an admin in the Portfolio manager, **When** they create a new portfolio item with media and assign it to a Category, **Then** it persists to the backend and appears correctly.
2. **Given** an admin in the Services manager, **When** they update bilingual content for a service, **Then** the backend persists both English and Arabic translations.

---

### User Story 4 - Contact Flow Integration (Priority: P2)
As a prospective client, I want to submit a contact inquiry that reaches the agency reliably, opening a WhatsApp conversation as a follow-up.

**Why this priority**: Direct channel for business leads.

**Independent Test**: Can be fully tested by submitting the contact form and verifying backend persistence before the WhatsApp redirect.

**Acceptance Scenarios**:
1. **Given** a visitor filling the contact form, **When** they submit valid data and pass anti-spam mechanisms, **Then** the backend confirms persistence, and the user is redirected to the WhatsApp number configured in settings.
2. **Given** a contact form submission that triggers a backend failure (5xx or network error), **When** the response is received, **Then** the frontend does NOT redirect to WhatsApp, displays a user-friendly error state without exposing sensitive backend details, preserves entered data, and allows the user to retry.

---

### User Story 5 - Arabic Localization (Priority: P2)
As an Arabic-speaking user, I want to view the website in Arabic with proper RTL layout so that I can comfortably interact with the agency.

**Why this priority**: Regional market requirement.

**Independent Test**: Can be fully tested by switching the language toggle and verifying layout integrity and RTL directionality.

**Acceptance Scenarios**:
1. **Given** a user viewing the English site, **When** they switch to Arabic, **Then** the layout switches to RTL without horizontal overflow or broken layouts.

### Edge Cases

- **Concurrent Admin Edits**: When multiple administrators edit the same content simultaneously, the frontend MUST detect a version-conflict/optimistic concurrency response from the backend. The frontend will prevent silent overwrites of newer data and display a clear recovery message asking the administrator to reload the latest version before saving again (relying purely on the backend API contract for concurrency).
- **Backend API Availability**: If the backend API contract is undefined for a specific feature, the frontend must explicitly mark the dependency rather than inventing endpoints or response shapes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Visual Quality)**: System MUST preserve the existing visual identity (dark aesthetic, crimson branding, noise texture, reveal animations). The goal is to productionize and harden the demo, not replace it with a generic redesign.
- **FR-002 (Performance)**: System MUST minimize client-side JavaScript, use React Server Components by default, avoid heavy initial rendering work, minimize CLS, and ensure visual effects do not compromise the LCP (< 2.5s) on mobile 4G. Smooth interactions should target ~60fps where practical.
- **FR-003 (Media)**: System MUST use optimized responsive Cloudinary images and defer Vimeo players. Vimeo embeds MUST NOT load on portfolio listing cards unless explicitly required.
- **FR-004 (Security Boundaries)**: System MUST treat the backend authorization as the authoritative security boundary. Client-side validation is UX enhancement only. Secrets MUST NEVER be exposed in client code. Unnecessary backend error details MUST be hidden from the user.
- **FR-005 (API Contract)**: System MUST route 100% of API calls through the dedicated service layer. The frontend MUST NOT invent endpoints, request/response shapes, authentication flows, or error contracts that deviate from the ASP.NET Core API contract.
- **FR-006 (Forms & Anti-Spam)**: System MUST persist contact form submissions to the backend successfully before opening WhatsApp, and the form must include an anti-spam mechanism compatible with the backend.

### Key Entities

- **Portfolio**: Has media (images/videos with ordering), belongs to one Category.
- **Category**: Contains multiple Portfolios.
- **Service**: Has bilingual content, ordering, and visual assets.
- **Client**: Has logo/name and ordering.
- **Contact Request**: Contains inquiry details, anti-spam validation state.
- **Settings**: Contains global config (e.g., WhatsApp number).

### Scope
- **In Scope**: Home, About, Services, Portfolio, Portfolio Detail, Clients, Contact, Admin Login, Dashboard, Portfolio Management, Category Management, Services Management, Clients Management, Contact Requests, Settings, and Analytics.
- **Explicitly Out of Scope**: Blog, Calendar, Booking, public user accounts, complex role/permission systems, unrequested payment functionality, unrequested email marketing functionality.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public homepage LCP is under 2.5 seconds and CLS is near zero on a simulated mobile 4G connection.
- **SC-002**: 0% of authentication tokens or credentials (demo or production) are stored in client-side storage (uses HttpOnly cookies).
- **SC-003**: 100% of data fetching routes through the dedicated service layer exactly matching the backend API contract.
- **SC-004**: In the event of a contact form backend failure, 0 WhatsApp redirects occur until successful retry.
- **SC-005**: 0% of sensitive backend error traces are exposed to end-users on error boundaries or forms.

## Assumptions

- The ASP.NET Core backend API contracts are either already defined or will be defined synchronously without requiring the frontend to invent endpoints.
- The backend API implements optimistic concurrency control that the frontend can detect (e.g., via ETags, version numbers, or specific 409 Conflict status codes).
