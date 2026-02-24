# Fullstack E-Shop

A production-minded MERN e-commerce app showcasing end-to-end shopping flows (auth, cart, orders, and admin product management) with a deployable setup and CI-backed quality checks.

[![CI](https://github.com/ardidrizi/fullstack-eshop/actions/workflows/ci.yml/badge.svg)](https://github.com/ardidrizi/fullstack-eshop/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?logo=vercel)](https://fullstack-eshop.vercel.app)

## Live demo
- **Frontend (Vercel):** https://fullstack-eshop.vercel.app
- **Backend (Render API Base):** https://fullstack-eshop.onrender.com/api
- **Backend health:** https://fullstack-eshop.onrender.com/health
- **Backend readiness:** https://fullstack-eshop.onrender.com/ready

## Project highlights
- Full authentication-to-order flow with protected user/admin routes and JWT-based access control.
- Clean monorepo split (`client/` + `server/`) ready for independent cloud deployment.
- Production health endpoints (`/health`, `/ready`) for uptime checks and platform probes.
- CI coverage for server lint/tests plus client lint/tests/build on every PR.

## Key features
- JWT authentication with protected user and admin routes.
- Product catalog browsing with category and search support.
- Cart and checkout-ready order workflow.
- Admin-only product management endpoints for create/update/delete.
- Responsive React UI with reusable components and route-based pages.
- CI pipeline validating server lint/tests and client lint/tests/build on pull requests.

## Tech stack
| Layer | Stack |
| --- | --- |
| Client | React, React Router, Vite, ESLint |
| Server | Node.js, Express, Mongoose |
| DB | MongoDB Atlas (or compatible MongoDB deployment) |
| Auth | JWT + bcrypt password hashing |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

## Architecture overview
This repository is organized as a simple two-app monorepo:
- `client/`: React SPA (pages, components, context, API service helpers)
- `server/`: Express API (routes, controllers, models, middleware, seeding)
- `docs/`: project architecture and screenshot guidance

For a quick diagram and request flow, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Local setup
### 1) Clone and install
```bash
git clone https://github.com/ardidrizi/fullstack-eshop.git
cd fullstack-eshop
npm --prefix server install
npm --prefix client install
```

### 2) Configure environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3) Start development servers
```bash
# terminal 1
npm --prefix server run dev

# terminal 2
npm --prefix client run dev
```

- Client runs on `http://localhost:5173`
- API runs on `http://localhost:3000`

## Environment variables
### `server/.env`
- `PORT`: API server port (default `3000`).
- `MONGO_URI`: MongoDB connection string. Create from MongoDB Atlas Database > Connect > Drivers.
- `MONGO_URL` (optional): backward-compatible alias for older local configs.
- `JWT_SECRET`: random secret used to sign auth tokens (`openssl rand -base64 32` works well).
- `FRONTEND_URL`: Vercel frontend origin allowed by backend CORS (for example `https://<vercel-app>.vercel.app`).

> After updating backend environment variables (including `FRONTEND_URL`), redeploy/restart the backend so the new values are applied.

### `client/.env`
- `VITE_API_URL`: base API URL consumed by client (`http://localhost:3000/api` locally). For Vercel + Render set `VITE_API_URL=https://<render-service>.onrender.com/api`.

## Deployment
### Frontend (Vercel)
Use the following project settings:

```txt
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Set this environment variable in Vercel:

```txt
VITE_API_URL=https://fullstack-eshop.onrender.com/api
```

> Vite only exposes `VITE_*` variables to the client bundle, and these variables are injected at build time.

### Backend (Render)
Set these Render environment variables:

```txt
MONGO_URI=...
JWT_SECRET=...
FRONTEND_URL=https://fullstack-eshop.vercel.app
```

`FRONTEND_URL` must be the exact frontend origin with **no trailing slash**.

> The seeding workflow reads `MONGO_URI` first and falls back to `MONGO_URL` for backward compatibility.

## Seed/demo data
The API includes a production-safe seed workflow that inserts missing records by unique key (idempotent by default).
Product images are sourced from curated per-category image pools so seeded catalogs stay visually realistic and category-consistent.

### Local seeding
```bash
# optional first run
cp server/.env.example server/.env

# seeds categories, products, demo users, and demo orders
npm --prefix server run seed

# optional: clear only demo seed records first (only when you explicitly want a reset)
npm --prefix server run seed:clear

# optional: customize data volume and demo credentials
SEED_COUNT_PRODUCTS=48 DEMO_ADMIN_EMAIL=owner@eshop.dev DEMO_ADMIN_PASSWORD='StrongAdmin123!' npm --prefix server run seed
```

### Atlas/production seeding
Run the same script either from your machine (pointing at Atlas) or from Render Shell:

```bash
# from local machine against Atlas
MONGO_URI='mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority' npm --prefix server run seed

# if you intentionally need to rebuild seed data
MONGO_URI='mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority' npm --prefix server run seed:clear
```

Render Shell example:
```bash
cd /opt/render/project/src
npm --prefix server run seed
```

Environment flags used by the seed script:
- `SEED_CLEAR=true`: allow deleting existing demo seed records before inserting.
- `SEED_COUNT_PRODUCTS=40`: optional minimum product count.
- `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD`: admin demo credentials.
- `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`: primary demo customer credentials.
- `DEMO_USER_TWO_EMAIL`, `DEMO_USER_TWO_PASSWORD`: optional secondary demo customer credentials.

## Health endpoints
The API exposes lightweight operational endpoints suitable for Render (and similar PaaS health probes):

- `GET /health` returns `200` with process-level metadata and does **not** require auth or database access.
- `GET /ready` returns:
  - `200` when `mongoose.connection.readyState === 1` (connected)
  - `503` otherwise

Example:
```bash
curl -i http://localhost:3000/health
curl -i http://localhost:3000/ready
```

> Note: Render free-tier services may cold start after inactivity, so first probe latency can be higher.


## Troubleshooting
### `TypeError: Failed to fetch` checklist
- Confirm `VITE_API_URL` includes `/api`:
  - ✅ `https://fullstack-eshop.onrender.com/api`
  - ❌ `https://fullstack-eshop.onrender.com`
- Confirm `FRONTEND_URL` matches the exact frontend origin and has **no trailing slash**:
  - ✅ Correct: `https://fullstack-eshop.vercel.app`
  - ❌ Incorrect: `https://fullstack-eshop.vercel.app/`
- Confirm health endpoint returns `200` JSON:
  - `curl -i https://fullstack-eshop.onrender.com/health`
- Confirm API 404 handler returns JSON (not HTML):
  - `curl -i https://fullstack-eshop.onrender.com/api/does-not-exist`

If browser requests fail but `curl` works, re-check backend CORS config (`FRONTEND_URL`) and redeploy Render.

## Screenshots
- Screenshot guidance and placeholders: [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md)
- Place image files under `docs/screenshots/`

![Homepage screenshot placeholder](docs/screenshots/homepage.png)
![Product page screenshot placeholder](docs/screenshots/product-page.png)

## Testing
```bash
# server API tests + server syntax lint
npm --prefix server run lint
npm --prefix server test

# client lint + smoke test + production build
npm --prefix client run lint
npm --prefix client test
npm --prefix client run build
```

## CI
GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every pull request and performs:
- **Server job:** install, lint, API tests
- **Client job:** install, lint, smoke test, build

## Roadmap
- Add end-to-end checkout coverage (browser-level tests).
- Add API OpenAPI/Swagger documentation.
- Improve order lifecycle (paid/shipped statuses + events).
- Add richer observability (structured logs and health checks).
- Introduce role-based admin dashboard analytics.

## Tradeoffs
- Backend API tests currently mock model persistence to keep CI fast and deterministic.
- Frontend test scope is a smoke-level server-render check, not full browser interaction coverage.
- Client API URL configuration now uses a single source of truth (`VITE_API_URL`) to reduce deployment misconfiguration risk.
- Architecture remains intentionally simple (monorepo with two apps) over heavier workspace tooling.
