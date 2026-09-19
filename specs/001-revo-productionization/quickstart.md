# Quickstart & Validation Guide

This guide describes how to validate the end-to-end functionality of the REVO Demo Productionization using the Mock Adapter.

## Prerequisites
- Node.js 20+ installed.
- Valid `.env.local` containing `NEXT_PUBLIC_DATA_MODE=mock` to enable realistic demo data and local mock authentication.

## Setup & Run
```bash
pnpm install
pnpm dev
```

## Validation Scenarios

### 1. Public Browsing & Demo Visual Preservation
- **Action**: Open `http://localhost:3000` in a browser.
- **Expected**: The site loads the realistic mock data (Services, Portfolios, Clients). The cinematic visual identity (dark aesthetic, GSAP reveal animations, noise texture, gradients, client marquee) is perfectly preserved.

### 2. Performance & Optimizations
- **Action**: Monitor initial load on homepage.
- **Expected**: LCP is under 2.5s. Unnecessary global mousemove listeners are debounced/removed. Heavy initial animations do not block rendering. Unoptimized images have been replaced with Next.js Image components using Cloudinary URLs.

### 3. Localization (Bilingual Support)
- **Action**: Navigate to `http://localhost:3000/ar` (or use the language switcher).
- **Expected**: Layout shifts to RTL. Bilingual mock data displays Arabic strings for titles and descriptions. No horizontal scrolling occurs.

### 4. Contact Form & Mock Failure
- **Action**: Submit the contact form on `/contact` with valid data.
- **Expected**: Form submits via the mock adapter and simulates a WhatsApp redirect.
- **Action**: Enable forced-error mode in the mock adapter (if configured for testing) and submit.
- **Expected**: The WhatsApp redirect does NOT happen, UI shows a safe error message, and data is preserved.

### 5. Admin Content Management (Mock Mode)
- **Action**: Navigate to `/admin/login` and login using mock credentials.
- **Expected**: Redirected to `/admin/dashboard`.
- **Action**: Navigate to the Portfolio Manager and test CRUD, ordering, and publish/unpublish toggles.
- **Expected**: The mock adapter successfully updates local state, simulating a full API lifecycle, including handling media (images/videos) and order index management.
