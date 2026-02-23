# Fullstack E-Shop

A production-minded MERN e-commerce app showcasing end-to-end shopping flows (auth, cart, orders, and admin product management) with a deployable setup and CI-backed quality checks.

[![CI](https://github.com/ardidrizi/fullstack-eshop/actions/workflows/ci.yml/badge.svg)](https://github.com/ardidrizi/fullstack-eshop/actions/workflows/ci.yml)

## Live demo
- Railway: https://fullstack-eshop-production.up.railway.app/

## Key features
- JWT authentication with protected user and admin routes.
- Product catalog browsing with category and search support.
- Cart and checkout-ready order workflow.
- Admin-only product management endpoints for create/update/delete.
- Responsive React UI with reusable components and route-based pages.
- CI pipeline validating server lint/tests and client lint/tests/build on pull requests.

## Tech stack
- **Client:** React, React Router, Vite, ESLint
- **Server:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas (or compatible MongoDB deployment)
- **Auth:** JWT + bcrypt password hashing

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
- `MONGO_URL`: MongoDB connection string. Create from MongoDB Atlas Database > Connect > Drivers.
- `JWT_SECRET`: random secret used to sign auth tokens (`openssl rand -base64 32` works well).
- `CLIENT_ORIGIN`: allowed browser origin(s) for CORS. Use comma-separated values for multiple environments.

### `client/.env`
- `VITE_API_URL`: base API URL consumed by client (`http://localhost:3000/api` locally).
- `VITE_SERVER_URL`: product endpoint URL used by product service calls.

## Seed/demo data
Create users directly through the UI (`/register`) or API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"password123"}'
```

To mark a user as admin for local testing, update the user role in MongoDB (`role: "admin"`) and re-login.

To seed sample products:
```bash
npm --prefix server run seed
```

## Screenshots
- Screenshot guidance and placeholders: [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md)
- Place image files under `docs/screenshots/`

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
- Client still uses a direct product endpoint env variable for compatibility with existing code.
- Architecture remains intentionally simple (monorepo with two apps) over heavier workspace tooling.
