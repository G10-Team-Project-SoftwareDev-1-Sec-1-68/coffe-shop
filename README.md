# KAFUNG Coffee Bar

A Next.js 15 (App Router) coffee shop project with menu and order management, auth-protected routes, and REST API for CRUD operations.

---

## Requirements

- **Node.js** 18+
- **pnpm** (recommended) or npm/yarn

---

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # then fill in your values
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command       | Description                    |
|--------------|---------------------------------|
| `pnpm dev`   | Start dev server (Turbopack)    |
| `pnpm build` | Build for production            |
| `pnpm start` | Run production build             |
| `pnpm lint`  | Run ESLint                      |

---

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # REST API routes (CRUD)
│   │   │   ├── menu/           # Menu items API
│   │   │   │   ├── route.js    # GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.js # GET one, PUT, DELETE
│   │   │   └── orders/         # Orders API
│   │   │       ├── route.js    # GET list, POST create
│   │   │       └── [id]/
│   │   │           └── route.js # GET one, PUT, DELETE
│   │   ├── components/         # Page-level components
│   │   │   └── Header.jsx
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── menu/
│   │   │   └── page.jsx
│   │   ├── order/
│   │   │   └── page.jsx
│   │   ├── globals.css
│   │   ├── layout.js           # Root layout & metadata
│   │   └── page.js             # Home page
│   ├── lib/
│   │   ├── constants.js        # PROTECTED_PATHS, shared config
│   │   └── utils.js            # cn() for Tailwind
│   └── middleware.js          # Auth check for /menu, /order
├── .env.example
├── jsconfig.json              # Path alias: @/* → ./src/*
├── next.config.mjs
├── package.json
└── README.md
```

### Overview

| Path | Purpose |
|------|--------|
| `src/app/` | Pages and layouts (App Router). Each `page.js`/`page.jsx` is a route. |
| `src/app/api/` | API route handlers. Each `route.js` exports `GET`, `POST`, `PUT`, `DELETE`. |
| `src/app/components/` | Reusable UI used by pages (e.g. `Header`). |
| `src/lib/` | Shared utilities and constants (e.g. `cn`, `PROTECTED_PATHS`). |
| `src/middleware.js` | Runs before requests; redirects unauthenticated users from protected paths to `/login`. |

---

## Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home / landing | No |
| `/login` | Login | No |
| `/menu` | Menu listing | Yes |
| `/order` | Order | Yes |

Protected routes (`/menu`, `/order`) require the `auth-token` cookie; otherwise the user is redirected to `/login?from=<path>`.

---

## API Reference (CRUD)

Base URL when running locally: `http://localhost:3000/api`

### Menu

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/menu` | List all menu items. Response: `{ items: [] }`. |
| `POST` | `/api/menu` | Create a menu item. Body: `{ name, price, category?, description? }`. |
| `GET` | `/api/menu/[id]` | Get one menu item by `id`. |
| `PUT` | `/api/menu/[id]` | Update a menu item. Body: `{ name?, price?, category?, description? }`. |
| `DELETE` | `/api/menu/[id]` | Delete a menu item. |

**Example: Create menu item**

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Espresso","price":45,"category":"coffee"}'
```

**Example: List menu**

```bash
curl http://localhost:3000/api/menu
```

### Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orders` | List orders (query params optional, e.g. `?status=pending`). Response: `{ orders: [] }`. |
| `POST` | `/api/orders` | Create an order. Body: `{ items: [{ menuItemId, quantity }], note? }`. |
| `GET` | `/api/orders/[id]` | Get one order by `id`. |
| `PUT` | `/api/orders/[id]` | Update an order (e.g. status). Body: `{ status?, items?, note? }`. |
| `DELETE` | `/api/orders/[id]` | Delete/cancel an order. |

**Example: Create order**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menuItemId":"uuid-here","quantity":2}],"note":"No sugar"}'
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (if using Supabase Auth/Storage). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key. |
| `DATABASE_URL` | PostgreSQL connection string (if using Prisma). |

---

## Adding Persistence (Prisma)

The API route files contain `TODO` comments where database calls should go. To wire Prisma:

1. Create `prisma/schema.prisma` and define your models (e.g. `MenuItem`, `Order`).
2. Run `pnpm prisma generate` and `pnpm prisma db push` (or `migrate`).
3. Create a shared `src/lib/db.js` that exports a Prisma client instance.
4. In each `src/app/api/**/route.js`, import the client and replace the `TODO` logic with `prisma.menuItem.*` / `prisma.order.*` calls.

---

## Path Alias

Imports can use `@/` for `src/`:

```js
import Header from "@/app/components/Header";
import { PROTECTED_PATHS } from "@/lib/constants";
```

Defined in `jsconfig.json` → `"@/*": ["./src/*"]`.

---

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4**
- **Prisma** (optional, for DB)
- **Supabase** (optional, for Auth/backend)
- **Zod** (validation)
- **shadcn/ui** (components)
