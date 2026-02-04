# Copilot instructions

## Build, test, lint
- Client install: `cd client && npm install`
- Server install: `cd server && npm install`
- Client dev server: `cd client && npm run dev`
- Server dev (nodemon): `cd server && npm run dev`
- Client build (outputs to server/public): `cd client && npm run build`
- Client lint: `cd client && npm run lint`
- Server start (prod): `cd server && npm run start`
- Server seed data: `cd server && npm run seed`
- Tests: no automated test suite configured (`server` uses a placeholder `npm test` script).

## High-level architecture
- Full-stack app with a Vite + React client in `client/` and an Express + MongoDB API in `server/`.
- Vite build outputs to `server/public`, and `server/server.js` serves that static bundle plus the REST API.
- API routes are mounted under `/api` (products, auth, cart, orders, admin products) and use Mongoose models in `server/models`.
- Auth uses JWTs; the client stores the token in `localStorage` and attaches it in `client/src/services/api.js`.

## Key conventions
- Environment variables:
  - `server/.env`: `MONGO_URL`, `PORT`, `JWT_SECRET` (optional; defaults to `dev-secret`).
  - `client/.env`: `VITE_SERVER_URL` (products base, e.g. `http://localhost:3000/api/products`), `VITE_API_URL` (API base, e.g. `http://localhost:3000/api`).
- Protected routes:
  - Client uses `components/ProtectedRoute.jsx` with `requireAdmin` for admin pages.
  - Server uses `middleware/auth.js` (`requireAuth`, `requireAdmin`) on admin and cart/order routes.
- Admin product management uses `/api/admin/products` and expects `images` array in payload.
- Cart and order endpoints require auth and are scoped to the logged-in user.
- Product search endpoint is `/api/products/search` and expects `keyword` query param.
- Seeds: run `cd server && npm run seed` to create demo data; default admin login is `admin@eshop.dev` / `Admin123!` (from README).
