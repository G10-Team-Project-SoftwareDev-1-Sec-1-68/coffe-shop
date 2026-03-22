# ☕ KAFUNG Coffee Bar

> ระบบจัดการร้านกาแฟและออเดอร์ออนไลน์ครบวงจร สร้างด้วย Next.js 15 App Router  
> พร้อมระบบ Pricing Engine, Offline POS Sync, BOM Inventory และ Interactive API Docs

---

## สารบัญ (Table of Contents)

| หัวข้อ | ลิงก์ |
|--------|--------|
| แนะนำโปรเจกต์ | [แนะนำโปรเจกต์](#แนะนำโปรเจกต์) |
| Tech Stack | [Tech Stack](#tech-stack) |
| Getting Started / Installation | [Getting Started](#getting-started) |
| การรัน Database ด้วย Docker | [Database Setup](#database-setup-docker--prisma) |
| โครงสร้างโปรเจกต์ | [Project Structure](#project-structure) |
| Scripts ที่สำคัญ | [Scripts](#scripts) |
| CLI Reference แบบละเอียด | [CLI Reference](#cli-reference) |
| หน้าเว็บ | [Pages](#pages) |
| API Reference | [API Reference](#api-reference) |
| Unit Tests | [Unit Tests-Vitest](#unit-tests-vitest) |
| Auth & Role Permissions | [Authentication](#authentication) |
| Environment Variables | [Environment Variables](#environment-variables) |
| การแก้ไข UI | [การแก้ไข UI](#การแก้ไข-ui) |
| การขยายโปรเจกต์ | [การขยายโปรเจกต์](#การขยายโปรเจกต์) |

---

## แนะนำโปรเจกต์

**KAFUNG Coffee Bar** คือ Backend API และ Web App สำหรับบริหารจัดการร้านกาแฟ ครอบคลุมตั้งแต่การจัดการเมนู, สต็อกวัตถุดิบ, ระบบออเดอร์, การชำระเงิน ไปจนถึงการซิงค์ข้อมูลจาก POS ที่ทำงานแบบ Offline

### ✨ ความสามารถหลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🔐 **Auth & Users** | Login ด้วย JWT (custom `jsonwebtoken` + `bcryptjs`), สมัครสมาชิก, แบ่ง Role (CUSTOMER / STAFF / ADMIN) |
| 🧾 **Products & BOM** | จัดการเมนูพร้อม Variants (ร้อน/เย็น) และ Options (หวาน/นม) ตัดสต็อกอัตโนมัติตามสูตร Bill of Materials ผ่าน Prisma Transaction |
| 🛒 **Orders & POS Sync** | คำนวณราคา (ส่วนลดสมาชิก, โปรโมชัน, VAT 7%) และรับ Bulk Sync ออเดอร์จาก POS ที่ Offline ผ่าน `/api/orders/sync` |
| 💳 **Payments & Promotions** | รองรับการชำระเงิน CASH / QR และระบบตรวจสอบโค้ดส่วนลด |
| 🏆 **Loyalty & Scheduling** | ระบบแต้มสะสมและระดับสมาชิก (Bronze/Silver/Gold), จองเวลารับสินค้าตามเวลาทำการ |
| 📚 **API Docs** | ดู Interactive Docs ได้ที่ `/docs` (powered by Scalar UI + OpenAPI) |
| 🧪 **Unit Tests** | ครอบคลุม Pricing, Offline Sync, BOM Inventory, Scheduling, Loyalty ด้วย Vitest |

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | JavaScript (ไม่มี TypeScript, ไฟล์ API ใช้ `.js`) |
| **Database** | PostgreSQL |
| **ORM** | Prisma (`@/lib/prisma.js`) |
| **Auth** | Custom JWT — `jsonwebtoken` + `bcryptjs` ตรวจสอบผ่าน Middleware |
| **Validation** | Zod |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui |
| **API Docs** | Scalar UI + OpenAPI Spec |
| **Testing** | Vitest, jsdom, @testing-library/react |

---

## Getting Started

### สิ่งที่ต้องมีก่อน (Prerequisites)

- [Node.js](https://nodejs.org/) v18 หรือสูงกว่า
- [pnpm](https://pnpm.io/) (แนะนำ) หรือ npm
- [Docker](https://www.docker.com/) + Docker Compose

### 1. Clone & ติดตั้ง Dependencies

```bash
git clone https://github.com/your-org/kafung-coffee-bar.git
cd kafung-coffee-bar

pnpm install
```

> ถ้ารัน `pnpm dev` แล้วเจอ `next: command not found` ให้รัน `pnpm install` ก่อนเสมอ

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

แก้ไขค่าในไฟล์ `.env`:

```env
# Database — ต้องตรงกับที่ตั้งใน docker-compose.yml
DATABASE_URL="postgresql://kafung_user:kafung_pass@localhost:5432/kafung_db"

# JWT Secret — ใช้ค่าที่ยาวและคาดเดายาก
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Database Setup (Docker + Prisma)

ระบบฐานข้อมูลใช้ PostgreSQL ผ่าน Docker **ต้องเปิด Database ก่อนรันโปรเจกต์เสมอ**

### 3. เปิด PostgreSQL ด้วย Docker

```bash
# เปิด Container แบบ Background
docker compose up -d

# ตรวจสอบสถานะ
docker compose ps
```

### 4. Push Schema และเตรียม Database

```bash
# สร้างตารางทั้งหมดจาก Prisma Schema
pnpx prisma db push

# (Optional) ดูข้อมูลในฐานข้อมูลผ่าน GUI
pnpx prisma studio
```

### 5. รัน Development Server

```bash
pnpm dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)  
ดู API Documentation ที่ [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Project Structure

```
my-app/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js     # POST /api/auth/login — รับ credentials แจก JWT
│   │   │   │   └── register/
│   │   │   │       └── route.js     # POST /api/auth/register — สมัครสมาชิกใหม่
│   │   │   ├── users/
│   │   │   │   └── [id]/
│   │   │   │       └── route.js     # GET/PUT /api/users/:id
│   │   │   ├── products/
│   │   │   │   ├── route.js         # GET/POST /api/products
│   │   │   │   └── [id]/
│   │   │   │       └── route.js     # GET/PUT/DELETE /api/products/:id
│   │   │   ├── inventory/
│   │   │   │   ├── route.js         # GET/POST /api/inventory
│   │   │   │   └── bom/
│   │   │   │       └── route.js     # POST /api/inventory/bom — อัปเดตสูตร BOM
│   │   │   ├── orders/
│   │   │   │   ├── route.js         # GET/POST /api/orders
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js     # GET/PUT /api/orders/:id
│   │   │   │   └── sync/
│   │   │   │       └── route.js     # POST /api/orders/sync — Bulk Insert จาก POS Offline
│   │   │   ├── payments/
│   │   │   │   └── route.js         # POST /api/payments — บันทึกการชำระเงิน (CASH/QR)
│   │   │   └── promotions/
│   │   │       ├── route.js         # GET/POST /api/promotions
│   │   │       └── verify/
│   │   │           └── route.js     # POST /api/promotions/verify — ตรวจสอบโค้ดส่วนลด
│   │   ├── docs/
│   │   │   └── page.js              # Scalar UI — Interactive API Documentation
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── login/page.jsx
│   │   ├── menu/page.jsx
│   │   ├── order/page.jsx
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js                  # Home page
│   ├── lib/
│   │   ├── prisma.js                # Prisma Client singleton
│   │   ├── jwt.js                   # Utility: sign / verify JWT Token
│   │   ├── auth.js                  # Helper: ดึง User จาก Request header
│   │   ├── constants.js             # PROTECTED_PATHS, shared config
│   │   ├── pricing.js               # Pricing engine (base + options + discount + VAT)
│   │   ├── offline-db.js            # Offline queue (localStorage)
│   │   ├── date-utils.js            # Order scheduling, business hours validation
│   │   ├── loyalty.js               # Points & tiers (Bronze/Silver/Gold)
│   │   └── utils.js                 # cn() — merge Tailwind class names
│   ├── hooks/
│   │   └── useSyncQueue.js          # Offline sync facade
│   ├── services/
│   │   └── inventoryService.js      # BOM & stock deduction logic
│   └── middleware.js                # ตรวจสอบ JWT ก่อนเข้า Protected Routes
├── __tests__/
│   ├── pricing.test.js
│   ├── offline-sync.test.js
│   └── bom-inventory.test.js
├── prisma/
│   └── schema.prisma
├── .env.example
├── jsconfig.json                    # Path alias: @/* → ./src/*
├── next.config.mjs
├── vitest.config.mjs
└── package.json
```

### คำอธิบายไฟล์สำคัญ

| ไฟล์ | หน้าที่ |
|---|---|
| `src/lib/prisma.js` | Prisma Client singleton — import ตัวนี้ทุกที่ที่ต้องใช้ DB |
| `src/lib/pricing.js` | คำนวณราคา: base + options, ส่วนลดสมาชิก, โปรโมชัน %, VAT 7%, `calculateOrderTotal()` |
| `src/lib/offline-db.js` | Queue ออเดอร์ตอนเน็ตหลุด (localStorage), ดึง pending, อัปเดตสถานะ synced/failed |
| `src/lib/date-utils.js` | ตรวจเวลาทำการ, บล็อกเวลาที่ผ่านมาแล้ว, lead time, วันหยุด, `validatePickupTime()` |
| `src/lib/loyalty.js` | คำนวณแต้ม (10 THB = 1 point), tier ตาม spend, `redeemPoints()` |
| `src/services/inventoryService.js` | BOM: หาวัตถุดิบที่ต้องใช้, เช็คสต็อก, ตัดสต็อก, aggregate หลายรายการ |
| `src/middleware.js` | ตรวจ JWT Token ก่อนเข้า Protected Routes — Redirect ไป `/login` ถ้าไม่มีสิทธิ์ |
| `src/lib/constants.js` | `PROTECTED_PATHS` — เพิ่ม path ที่ต้องล็อกอินที่นี่ |

---

## Scripts

| คำสั่ง | ความหมาย |
|---|---|
| `pnpm dev` | รัน Development Server (Hot Reload, Turbopack) |
| `pnpm build` | Build สำหรับ Production |
| `pnpm start` | รัน Production Server (ต้อง build ก่อน) |
| `pnpm lint` | ตรวจโค้ดด้วย ESLint (Next.js lint) |
| `pnpm test` | รัน Unit Tests แบบ Watch Mode |
| `pnpm test:run` | รัน Unit Tests ครั้งเดียว (เหมาะกับ CI) |
| `pnpm test:ui` | เปิด Vitest UI ใน Browser |
| `pnpm test:coverage` | รัน Tests พร้อม Coverage Report |

---

## CLI Reference

### Next.js

```bash
pnpm dev                      # โหมดพัฒนา (http://localhost:3000)
pnpm build                    # Build production
pnpm start                    # รัน production build
npx next dev --turbopack      # รันตรงโดยไม่ผ่าน script
```

### ESLint

```bash
pnpm lint                           # ตรวจทั้งโปรเจกต์
npx next lint --dir src/app         # ตรวจเฉพาะโฟลเดอร์
npx next lint --fix                 # แก้ไขอัตโนมัติ (ถ้ารองรับ)
```

### Prisma

```bash
pnpx prisma db push                  # Push Schema ไปยัง DB (ไม่เก็บ migration history)
pnpx prisma migrate dev --name x     # สร้าง migration พร้อม apply (เก็บ history)
pnpx prisma generate                 # Re-generate Prisma Client หลังแก้ Schema
pnpx prisma studio                   # เปิด GUI ดูข้อมูลใน DB
pnpx prisma migrate deploy           # Apply migration ใน Production
pnpx prisma migrate reset            # รีเซ็ต DB — ⚠️ ลบข้อมูลทั้งหมด
```

### Vitest

```bash
pnpm test                                      # Watch mode — รันใหม่ทุกครั้งที่บันทึกไฟล์
pnpm test:run                                  # รันครั้งเดียว
pnpm test:ui                                   # เปิด Vitest UI
pnpm test:coverage                             # Coverage report

npx vitest run src/lib/pricing.test.js         # รันเฉพาะไฟล์
npx vitest run -t "Pricing Engine"             # รันเฉพาะ test ที่ชื่อตรง
npx vitest src/lib/pricing.test.js             # watch เฉพาะไฟล์
```

### shadcn/ui

```bash
npx shadcn@latest init                         # ตั้งค่า shadcn (ครั้งแรก)
npx shadcn@latest add button                   # เพิ่ม component
npx shadcn@latest add button card input        # เพิ่มหลายตัวพร้อมกัน
npx shadcn@latest add button --overwrite       # อัปเดต component ที่มีอยู่
```

### Docker

```bash
docker compose up -d     # เปิด PostgreSQL Container
docker compose ps        # ดูสถานะ Container
docker compose down      # ปิด Container
```

---

## Pages

| Route | หน้าที่ | ต้อง Login |
|-------|--------|-----------|
| `/` | Home / Landing page | ❌ |
| `/login` | Login | ❌ |
| `/menu` | รายการเมนู | ✅ |
| `/order` | สั่งออเดอร์ | ✅ |
| `/docs` | Interactive API Documentation | ❌ |

Routes ที่ต้องล็อกอิน (`/menu`, `/order`) จะตรวจสอบ `auth-token` cookie ผ่าน `middleware.js` — ถ้าไม่มีจะ Redirect ไป `/login?from=<path>`  
เพิ่ม Protected Route ใหม่ได้ที่ `src/lib/constants.js` → `PROTECTED_PATHS`

---

## API Reference

Base URL (local): `http://localhost:3000/api`  
ดู Interactive Docs ได้ที่ `/docs` (Scalar UI)

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | รับ `email` + `password` → คืน JWT Token |
| `POST` | `/api/auth/register` | สมัครสมาชิกใหม่ |

### Products

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | ดูเมนูทั้งหมด |
| `POST` | `/api/products` | เพิ่มเมนูใหม่ |
| `GET` | `/api/products/:id` | ดูเมนูเดียว |
| `PUT` | `/api/products/:id` | แก้ไขเมนู |
| `DELETE` | `/api/products/:id` | ลบเมนู |

### Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orders` | ดูออเดอร์ทั้งหมด (ใช้ `?status=pending` ได้) |
| `POST` | `/api/orders` | สร้างออเดอร์ใหม่ |
| `GET` | `/api/orders/:id` | ดูออเดอร์เดียว |
| `PUT` | `/api/orders/:id` | อัปเดตสถานะออเดอร์ |
| `POST` | `/api/orders/sync` | Bulk Insert ออเดอร์จาก POS Offline |

### Payments & Promotions

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/payments` | บันทึกการชำระเงิน (CASH / QR) |
| `GET` | `/api/promotions` | ดูโปรโมชันทั้งหมด |
| `POST` | `/api/promotions/verify` | ตรวจสอบโค้ดส่วนลด |

### Inventory

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/inventory` | ดูสต็อกวัตถุดิบ |
| `POST` | `/api/inventory/bom` | อัปเดตสูตร BOM |

**ตัวอย่าง Request:**

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@kafung.com","password":"your-password"}'

# สร้างออเดอร์ (ต้องใส่ JWT Token)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"items":[{"productId":"uuid","quantity":2}],"note":"ไม่ใส่น้ำตาล"}'
```

---

## Unit Tests (Vitest)

**Config:** `vitest.config.mjs` — environment `jsdom`, รัน `src/**/*.test.{js,jsx}`, path alias `@` → `src/`

### หลักการของ Tests

- **jsdom** ให้ DOM API (`localStorage`, `navigator`) ใช้งานได้ใน tests
- **@testing-library/react** สำหรับ Component tests
- ไฟล์ test อยู่ใกล้กับโค้ดที่ test ชื่อ `*.test.js` หรือ `*.test.jsx`
- แต่ละ `describe` จัดกลุ่ม scenario, แต่ละ `it`/`test` assert พฤติกรรมเดียว

### Test Coverage

| Test File | ฟีเจอร์ | สิ่งที่ทดสอบ |
|---|---|---|
| `pricing.test.js` | Pricing Engine | Base + options, ส่วนลดสมาชิก/VIP, โปรโมชัน %, fixed, VAT 7%, full pipeline |
| `offline-sync.test.js` | Offline Queue | เพิ่มออเดอร์ตอน offline, pending status, mark synced/failed, clear หลัง sync |
| `bom-inventory.test.js` | BOM & Inventory | วัตถุดิบที่ต้องใช้, บล็อกสั่งเมื่อสต็อกต่ำ, ตัดสต็อกแม่นยำ, aggregate หลายรายการ |
| `date-utils.test.js` | Order Scheduling | เวลาทำการ, บล็อกเวลาที่ผ่านมา, lead time 15 นาที, วันหยุด, `validatePickupTime()` |
| `loyalty.test.js` | Membership | คำนวณแต้ม (10 THB = 1 pt), tier upgrade (Bronze→Silver→Gold), `redeemPoints()` |
| `utils.test.js` / `constants.test.js` | Utils | `cn()` merge Tailwind, `PROTECTED_PATHS` content |
| `api/menu/route.test.js` | Menu API | GET คืน `{ items }`, POST validation 400/201 |
| `Header.test.jsx` | Header Component | Render brand, ลิงก์นำทาง, ปุ่ม Login, cart |

### คำสั่ง Test

| คำสั่ง | เหมาะกับ |
|--------|--------|
| `pnpm test` | ตอนพัฒนา — watch รันใหม่ทุกครั้งที่บันทึก |
| `pnpm test:run` | CI หรือเช็คก่อน commit |
| `pnpm test:ui` | ดู UI แบบ Visual ใน browser |
| `pnpm test:coverage` | ดู coverage report |

---

## Authentication

### Login Flow

```bash
# 1. ขอ Token
POST /api/auth/login
{ "email": "staff@kafung.com", "password": "your-password" }

# 2. แนบ Token ใน Header ทุก Request ที่ต้องสิทธิ์
Authorization: Bearer <token>
```

### Role Permissions

| Role | สิทธิ์ |
|---|---|
| `CUSTOMER` | ดูเมนู, สร้างออเดอร์, ดูประวัติออเดอร์ตัวเอง |
| `STAFF` | CUSTOMER + จัดการออเดอร์, ตรวจสอบสต็อก |
| `ADMIN` | STAFF + จัดการเมนู, จัดการ User, จัดการโปรโมชัน |

---

## Environment Variables

| Variable | Description | ตัวอย่าง |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/kafung_db` |
| `JWT_SECRET` | Secret key สำหรับ sign JWT | `my-super-secret-key` |
| `NEXT_PUBLIC_APP_URL` | URL ของแอป | `http://localhost:3000` |

---

## การแก้ไข UI

### การแก้ไขที่ทำไปแล้ว

| ส่วน | ไฟล์ | สิ่งที่เปลี่ยน |
|------|------|----------------|
| ธีมสี (โทนน้ำตาลกาแฟ) | `src/app/globals.css` | `:root` ใหม่: ครีม/ขาว พื้นหลัง, น้ำตาลเข้มปุ่ม, ทอง accent, ตัวแปร `--coffee-dark`, `--coffee-gold` |
| Landing page | `src/app/page.js` | Hero section, แถบเวลาทำการ, บล็อกสถิติ, "Our Delicious Services" cards |
| Header | `src/app/components/Header.jsx` | ลิงก์ Home/Services/Menu/Reviews, ไอคอน Search/Cart, ปุ่ม Signup |

### วิธีแก้ต่อ

| อยากแก้ | ไปที่ |
|--------|--------|
| สีทั้งโปรเจกต์ (พื้นหลัง, ปุ่ม, ตัวอักษร) | `src/app/globals.css` → บล็อก `:root` — แก้ `--primary`, `--background`, `--foreground` |
| เพิ่มสีใหม่ | เพิ่มใน `:root` และใน `@theme inline` เป็น `--color-ชื่อสี` |
| ข้อความ Hero / ปุ่ม / Sections | `src/app/page.js` |
| รูปภาพ Hero | ใส่รูปใน `public/` แล้วแทน placeholder ด้วย `<Image>` ใน `src/app/page.js` |
| เมนูบน Header / ลิงก์นำทาง | `src/app/components/Header.jsx` |
| เพิ่ม section ในหน้าแรก (Reviews, Gallery) | เพิ่ม `<section id="reviews">` ใน `src/app/page.js` แล้วลิงก์จาก Header เป็น `href="#reviews"` |
| เพิ่ม component จาก shadcn | `npx shadcn@latest add button card` → โค้ดไปที่ `src/components/ui/` |

---

## การขยายโปรเจกต์

| สิ่งที่ต้องเพิ่ม | วิธีทำ | อัปเดต README |
|---|---|---|
| **หน้าใหม่** | สร้างโฟลเดอร์ใน `src/app/` เช่น `src/app/about/page.jsx` | เพิ่มใน [Pages](#pages) |
| **Protected Route ใหม่** | เพิ่ม path ใน `src/lib/constants.js` → `PROTECTED_PATHS` | เพิ่มใน [Pages](#pages) |
| **API ใหม่** | สร้าง `src/app/api/<ชื่อ>/route.js` | เพิ่มใน [API Reference](#api-reference) |
| **DB Model ใหม่** | แก้ `prisma/schema.prisma` → `pnpx prisma generate` → `pnpx prisma db push` | อัปเดต [Environment Variables](#environment-variables) |
| **Component ใหม่** | `npx shadcn@latest add <component>` หรือสร้างใน `src/app/components/` | อัปเดต [Project Structure](#project-structure) |

**แนะนำ:** ทำตาม SRS ทีละฟีเจอร์ → เพิ่มหน้า/API/DB/component เสร็จแล้วค่อยอัปเดต README ในส่วนที่เกี่ยวข้อง จะได้ไม่หนักและ README ตรงกับโปรเจกต์เสมอ

---

## Path Alias

ใช้ `@/` แทน `src/` ได้ทุกที่:

```js
import { prisma } from "@/lib/prisma";
import Header from "@/app/components/Header";
import { PROTECTED_PATHS } from "@/lib/constants";
```

กำหนดไว้ใน `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## Contributing

1. Fork โปรเจกต์
2. สร้าง Feature Branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. เปิด Pull Request

**ข้อกำหนด:** PR ทุกอันต้องผ่าน `pnpm test:run` ก่อน Merge เสมอ

---

> Built with ☕ by the KAFUNG Team
