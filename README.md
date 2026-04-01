# LuxBiss

LuxBiss is a full-stack investment and wallet management platform split into two apps:

- `luxbiss_frontend`: Next.js frontend for landing pages, authentication, user dashboard, wallet flows, products, profile, and admin panels.
- `luxbiss_server`: Go API built with Gin, GORM, PostgreSQL, and Redis for auth, users, products, wallets, transactions, gift cards, managers, uploads, and admin reporting.

The backend can also serve an exported frontend build from embedded static assets.

## Workspace Structure

```text
.
├── luxbiss_frontend/
└── luxbiss_server/
```

## Main Product Areas

### Frontend

- Public landing page and about page
- Registration, login, Google OAuth login
- Forgot password, OTP verification, and password reset
- User dashboard, wallet page, profile page, and product pages
- Admin dashboard with management screens for users, ignored users, products, wallets, transactions, gift cards, and managers
- Zustand-based client state and Axios API client with cookie-based session refresh

### Backend

- Cookie-based JWT auth with refresh flow
- Email/password registration and login
- Google login endpoint
- Password reset via email OTP
- Role-based authorization for `admin` and `user`
- Product, level, and step management
- Wallet address management
- Transactions and investment endpoints
- Gift card creation, verification, and redemption
- Admin stats and recent activity
- Redis-backed rate limiting and OTP storage
- File upload endpoint for images
- Optional SMTP and Telegram integrations

## Tech Stack

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- Zustand
- Axios
- Recharts
- Google OAuth client

### Backend

- Go
- Gin
- GORM
- PostgreSQL
- Redis
- Viper
- Zap-based logging

## Frontend Routes

The Next.js app currently includes these main pages:

- `/`
- `/about`
- `/registration`
- `/login`
- `/forgot-password`
- `/otp-verification`
- `/new-password`
- `/email-verify`
- `/dashboard`
- `/wallet`
- `/profile`
- `/product`
- `/product/all`
- `/admin/dashboard`
- `/admin/users`
- `/admin/users/[id]`
- `/admin/ignored-users`
- `/admin/products`
- `/admin/wallet`
- `/admin/transactions`
- `/admin/giftcards`
- `/admin/managers`

## API Surface

All API routes are mounted under `/api/v1`.

### Public and Auth

- `GET /health`
- `GET /health/ready`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/google`
- `POST /auth/forgot-password`
- `POST /auth/verify-otp`
- `POST /auth/reset-password`
- `GET /products`
- `GET /products/:id`
- `GET /levels`
- `GET /levels/:level_id/steps`

### Authenticated User/Admin

- `GET /users/me`
- `GET /users/:id`
- `PUT /users/:id`
- `GET /wallets`
- `POST /transactions`
- `GET /transactions`
- `GET /transactions/summary`
- `GET /transactions/:id`
- `POST /transactions/invest`
- `POST /giftcards/apply`
- `POST /giftcards/verify`
- `POST /upload/image`

### Admin Only

- `GET /users`
- `DELETE /users/:id`
- `POST /users/advance-step`
- `POST /users/:id/approve-hold`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `POST /levels`
- `PUT /levels/:id`
- `DELETE /levels/:id`
- `POST /steps`
- `PUT /steps/:id`
- `DELETE /steps/:id`
- `POST /wallets`
- `PUT /wallets/:id`
- `DELETE /wallets/:id`
- `POST /managers`
- `GET /managers`
- `GET /managers/:id`
- `PUT /managers/:id`
- `DELETE /managers/:id`
- `POST /giftcards`
- `GET /giftcards`
- `DELETE /giftcards/:id`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`
- `GET /admin/dashboard/stats`
- `GET /admin/dashboard/recent-activity`

## Local Development

### Prerequisites

- Node.js
- Yarn or npm
- Go
- PostgreSQL
- Redis
- Docker and Docker Compose for containerized setup

## Frontend Setup

```bash
cd luxbiss_frontend
yarn install
yarn dev
```

The frontend runs on `http://localhost:3000` by default.

### Frontend Environment

Create `luxbiss_frontend/.env.local` with at least:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Backend Setup

Create `luxbiss_server/.env` with values matching your local services.

Minimum useful local example:

```env
APP_NAME=luxbiss-server
APP_ENV=dev

SERVER_PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=luxbiss
DB_SSLMODE=disable

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

JWT_SECRET=replace-with-a-secret-at-least-32-characters-long
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=168h
JWT_ISSUER=luxbiss-server

COOKIE_DOMAIN=
COOKIE_SECURE=false
COOKIE_SAMESITE=Lax
COOKIE_PATH=/

CORS_ALLOWED_ORIGINS=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=noreply@luxbiss.com

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=

BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_PROXY=
```

## CI/CD Pipeline

GitHub Actions is configured under [`.github/workflows/ci.yml`](/home/parvej/Client_Project/.github/workflows/ci.yml) and [`.github/workflows/cd.yml`](/home/parvej/Client_Project/.github/workflows/cd.yml).

### CI

`CI` runs on every pull request and on pushes to `main` and `develop`. It performs:

- frontend dependency install, lint, and production build
- backend module verification, `go test`, and API build
- full Docker image build validation against the root `Dockerfile`

### CD

`CD` runs on pushes to `main` and on manual dispatch. It:

- builds the production container
- pushes the image to GitHub Container Registry as `ghcr.io/<owner>/<repo>:latest`
- also tags each release with the commit SHA
- optionally deploys to a Linux host over SSH when deploy secrets are configured

### Required GitHub Secrets

For image publishing:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

For remote deployment:

- `DEPLOY_HOST`
- `DEPLOY_PORT` (optional, defaults to `22`)
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `GHCR_DEPLOY_USER`
- `GHCR_DEPLOY_TOKEN`
- `ENV_FILE_PATH` (optional, defaults to `/opt/luxbiss/.env`)
- `UPLOADS_PATH` (optional, defaults to `/opt/luxbiss/uploads`)
- `APP_PORT` (optional, defaults to `8080`)
- `CONTAINER_NAME` (optional, defaults to `luxbiss-api`)

### Remote Host Expectations

The SSH deployment step assumes the target server already has:

- Docker installed and running
- a runtime env file present at `ENV_FILE_PATH`
- any required backing services such as PostgreSQL and Redis reachable from the container

The workflow replaces the running app container with the newest `latest` image and mounts uploads from `UPLOADS_PATH` into `/app/public/uploads`.

Important backend notes:

- `JWT_SECRET` is required and must be at least 32 characters.
- In production, the server rejects `DB_SSLMODE=disable`.
- Auth uses HTTP-only cookies, so frontend requests must send credentials.

### Run Backend Locally

```bash
cd luxbiss_server
go run ./cmd/api
```

### Run Backend With Make

```bash
cd luxbiss_server
make run
```

Available useful commands:

- `make dev`
- `make run`
- `make build`
- `make test`
- `make lint`
- `make tidy`
- `make seed`
- `make seed-fresh`
- `make docker-up`
- `make docker-down`

## Docker Setup

The backend repo includes Docker Compose for:

- API container
- PostgreSQL 16
- Redis 7

Run:

```bash
cd luxbiss_server
make docker-up
```

Compose uses host networking and loads environment variables from `luxbiss_server/.env`.

## Database Seeding

The backend includes a seeder for users, levels, steps, products, and wallets.

Run:

```bash
cd luxbiss_server
make seed
```

To truncate and reseed:

```bash
cd luxbiss_server
make seed-fresh
```

### Seeded Accounts

- Admin: `admin@luxbiss.com`
- User: `user@luxbiss.com`
- Password: `Parvej@55`

### Seeded Data

- 20 levels
- 20 steps per level
- Generated products per step
- Wallet entries for Bitcoin, USDT, Litecoin, and Ethereum

## Auth Model

- Login and registration issue cookie-based sessions
- Frontend Axios client sends `withCredentials: true`
- On `401`, the frontend attempts `POST /auth/refresh` automatically
- User identity is restored on app load through `GET /users/me`

## Notes

- The frontend currently depends on the backend API at `http://localhost:8080/api/v1` unless overridden.
- The backend serves uploads from `luxbiss_server/public/uploads`.
- The backend can embed and serve a static frontend export from `luxbiss_server/cmd/api/web/out`.
- Existing subproject READMEs still exist, but this file is the best starting point for the workspace as a whole.
