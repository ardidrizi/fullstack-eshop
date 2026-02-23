# Contributing

Thanks for contributing to **fullstack-eshop**.

## Run locally
```bash
git clone https://github.com/ardidrizi/fullstack-eshop.git
cd fullstack-eshop
npm --prefix server install
npm --prefix client install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm --prefix server run dev
npm --prefix client run dev
```

## Run checks
```bash
npm --prefix server run lint
npm --prefix server test
npm --prefix client run lint
npm --prefix client test
npm --prefix client run build
```

## Branch naming
Use short, descriptive branches:
- `docs/readme-refresh`
- `test/api-smoke`
- `chore/ci-workflow`

## Commit messages
Prefer clear, imperative commits:
- `docs: rewrite README for portfolio readiness`
- `test: add node-based API coverage for auth/products`
- `ci: add pull request workflow for server and client`
