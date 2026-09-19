# Provisional API Contracts

**IMPORTANT**: These endpoints represent the *anticipated* contract from the ASP.NET Core backend. They are strictly provisional. The frontend MUST NOT treat these as authoritative until confirmed by the backend/OpenAPI contract. The frontend will use typed service interfaces and adapters to isolate itself from changes, but actual paths, request shapes, and error contracts will be dictated by the backend.

## Environment & Strategy
- `NEXT_PUBLIC_DATA_MODE=mock`: Routes calls to a robust mock adapter pre-populated with realistic demo data (Categories, Portfolios, media, Services, Clients) to allow full visual testing before the backend is ready.
- `NEXT_PUBLIC_DATA_MODE=production`: Routes calls to the ASP.NET Core backend using `NEXT_PUBLIC_API_URL`.

## Provisional Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

*Note on Mock Authentication*: Mock authentication must NOT store authentication tokens, passwords, or session secrets in `localStorage` or `sessionStorage` at any time. Mock auth must be strictly isolated and architected so it physically cannot be executed or enabled in the production build.

## Provisional Public Endpoints
- `GET /api/portfolios`
- `GET /api/portfolios/{id}`
- `GET /api/categories`
- `GET /api/services`
- `GET /api/clients`
- `GET /api/settings`
- `POST /api/contact`

## Provisional Admin Endpoints (Require Auth)
*Full CRUD operations supporting list, read, create, update, delete, ordering, and publishing.*
- `POST /api/portfolios`
- `PUT /api/portfolios/{id}`
- `DELETE /api/portfolios/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `POST /api/services`
- `PUT /api/services/{id}`
- `DELETE /api/services/{id}`
- `POST /api/clients`
- `PUT /api/clients/{id}`
- `DELETE /api/clients/{id}`
- `GET /api/contact`
- `PUT /api/settings`

## Error Handling & Concurrency
- Concurrency and version-conflict resolution will strictly follow the backend's eventual API contract (e.g., specific HTTP 409 schemas or ETags). The mock adapter will simulate optimistic concurrency conflicts for testing.
