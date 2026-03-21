# KAFUNG Coffee Bar

A Next.js 15 (App Router) coffee shop project with menu and order management, auth-protected routes, REST API for CRUD, and **unit tests** for pricing, offline sync, inventory (BOM), order scheduling, and membership loyalty.

---

## สรุปโปรเจกต์ (สำหรับเพื่อน)

โปรเจกต์นี้คือ **เว็บร้านกาแฟ KAFUNG** ทำด้วย Next.js 15 มีหน้าหลัก เข้าสู่ระบบ เมนู และสั่งออเดอร์

**รันโปรเจกต์ (ในโฟลเดอร์ `my-app`):**
ระบบฐานข้อมูลของเราใช้ PostgreSQL ผ่าน Docker ดังนั้นก่อนรันโปรเจกต์ ต้องเปิด Database ก่อนเสมอครับ

```bash
# 1. ติดตั้ง Dependencies
pnpm install

# 2. ก๊อปปี้ไฟล์ตัวแปรแวดล้อม (และตั้งค่า DATABASE_URL ตามที่ตกลงกัน)
cp .env.example .env

# 3. เปิดการทำงาน Database (PostgreSQL) ด้วย Docker แบบ Background
docker compose up -d

# 4. อัปเดตโครงสร้างตารางใน Database ให้พร้อมใช้งาน
pnpx prisma db push

# 5. รันเว็บโหมด Development
pnpm dev
แล้วเปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)
```

### 🐘 การจัดการฐานข้อมูล (Database Workflow)

หลังจากเปิด Database ด้วย Docker (`docker compose up -d`) แล้ว เราจะใช้คำสั่ง Prisma หลักๆ 2 ตัวในการทำงานครับ:

#### 1. อัปเดตโครงสร้างฐานข้อมูล (`db push`)
ทุกครั้งที่คุณมีการ **เพิ่ม แก้ไข หรือลบ Model** ในไฟล์ `prisma/schema.prisma` คุณต้องรันคำสั่งนี้เพื่อให้ Prisma นำโครงสร้างใหม่ไปสร้างเป็นตารางใน PostgreSQL:

```bash
pnpx prisma db push
```


### เปิด table database 
```bash
pnpx prisma studio
```


**สิ่งที่โปรเจกต์มี:**
- หน้าเว็บ: หน้าแรก, ล็อกอิน, เมนู, สั่งออเดอร์ (เมนูกับออเดอร์ต้องล็อกอินก่อน)
- API: สร้าง/ดู/แก้/ลบ เมนูและออเดอร์ ผ่าน `/api/menu` และ `/api/orders`
- Logic ด้านธุรกิจ: คำนวณราคา (ฐาน+ตัวเลือก+ส่วนลดสมาชิก+โปรโมชัน+VAT 7%), คิวออเดอร์ตอนออฟไลน์, ตัดสต็อกตามสูตร (BOM), เลือกเวลารับสินค้า, ระบบแต้มและระดับสมาชิก
- Unit Test: ใช้ Vitest รันเทสทั้งหมดด้วย `pnpm test:run`

**คำสั่งที่ใช้บ่อย:**
| ต้องการ | คำสั่ง |
|--------|--------|
| รันเว็บ | `pnpm dev` |
| ตรวจโค้ด (lint) | `pnpm lint` |
| รันเทส | `pnpm test:run` |
| Build ขึ้น production | `pnpm build` แล้ว `pnpm start` |

คำสั่ง CLI แบบละเอียด (Next, Lint, Prisma, Vitest, shadcn) อยู่ที่ [CLI Reference](#cli-reference) ด้านล่าง

---

## รองรับการขยายโปรเจกต์ไหม (เมื่อทำตาม SRS)

**ตอบ: รองรับครับ** โครงสร้างตอนนี้ออกแบบให้เพิ่มหน้าต่าง ๆ เพิ่ม DB, config สี/ธีม และ component ได้ไม่ยาก ทำตาม SRS แล้วค่อย ๆ เพิ่มทีละส่วน แล้วค่อยอัปเดต README ตามได้

| สิ่งที่ต้องเพิ่ม | ทำยังไง (สรุป) | อัปเดต README |
|------------------|-----------------|----------------|
| **หน้าใหม่** | สร้างโฟลเดอร์ใน `src/app/` เช่น `src/app/about/page.jsx` → ได้ route `/about` | เพิ่มใน [Pages](#pages) และถ้าเป็น route ที่ต้องล็อกอิน → เพิ่ม path ใน `src/lib/constants.js` (PROTECTED_PATHS) |
| **API ใหม่** | สร้าง `src/app/api/<ชื่อ>/route.js` (GET/POST) และ `[id]/route.js` ถ้าต้อง CRUD | เพิ่มใน [API Reference](#api-reference-crud) |
| **ฐานข้อมูล (DB)** | ใช้ Prisma: สร้าง/แก้ `prisma/schema.prisma` → `npx prisma generate` และ `db push` หรือ `migrate dev` | เพิ่มตัวแปรใน [Environment Variables](#environment-variables), อัปเดต [Adding Persistence](#adding-persistence-prisma) ถ้ามีขั้นตอนเพิ่ม |
| **Config สี / ธีม** | แก้ `src/app/globals.css` (ตัวแปร CSS) หรือใช้ Tailwind theme ใน config; ถ้ามีไฟล์ config แยก ใส่ใน `src/lib/` | ถ้ามีตัวแปรหรือไฟล์ใหม่ → บอกใน README ส่วนที่เกี่ยวข้อง |
| **Component (ปุ่ม, การ์ด ฯลฯ)** | ใช้ shadcn: `npx shadcn@latest add button` ฯลฯ โค้ดจะไปที่ `src/components/ui/` หรือใส่ component เองใน `src/app/components/` | ถ้าเป็น pattern ใหม่หรือโฟลเดอร์ใหม่ → อัปเดต [Project Structure](#project-structure) / [What each file does](#what-each-file-does-added-for-features--tests) |

**ข้อแนะนำ:** ทำตาม SRS ทีละฟีเจอร์ → พอเพิ่มหน้า/API/DB/config/component แล้ว ค่อยมาเพิ่มบรรทัดใน README (ตารางหน้า, ตาราง API, โครงสร้าง, คำอธิบายไฟล์) จะได้ไม่หนักและ README ตรงกับโปรเจกต์เสมอ

---

## การแก้ไข UI ที่ทำไปแล้ว + วิธีแก้ต่อ

### สรุปว่าแก้ UI อะไรไปบ้าง

| ส่วน | ไฟล์ | สิ่งที่เปลี่ยน |
|------|------|----------------|
| **ธีมสี (โทนน้ำตาลกาแฟ)** | `src/app/globals.css` | ตั้งค่า `:root` ใหม่: พื้นหลังโทนครีม/ขาว, ตัวอักษรและปุ่มโทนน้ำตาลเข้ม, สีทองสำหรับ accent (โลโก้). เพิ่มตัวแปร `--coffee-dark`, `--coffee-gold` และผูกกับ `@theme` ให้ใช้ class เช่น `bg-primary`, `bg-coffee-gold` ได้ |
| **Landing page (หน้าแรก)** | `src/app/page.js` | เพิ่ม Hero (หัวข้อ "Discover The Art Of Perfect Coffee", ข้อความใต้หัวข้อ, ปุ่ม Order Now), แถบสีน้ำตาลด้านบน (เวลาเปิดบริการ), บล็อกสถิติ (1K+ Reviews, 3K+ Best Sell, 150+ Menu), ส่วน "Our Delicious Services" พร้อมการ์ดบริการ 3 อัน. ภาพถ้วยกาแฟด้านขวาเป็น placeholder (ไอคอน) รอแทนที่ด้วยรูปใน `public/` ได้ |
| **Header** | `src/app/components/Header.jsx` | เก็บโลโก้เดิม (KAFUNG + coffee bar + ไอคอน ☕). เพิ่มลิงก์เมนู: Home, Services, Menu, Reviews. เพิ่มไอคอนค้นหา (Search), ตะกร้า (ลิงก์ไป `/order`), ปุ่ม Signup (ลิงก์ไป `/login`). ใช้สีจาก theme (พื้นหลังไม่ใช่สีเดียวกับเดิม) |
| **shadcn** | `components.json` | ยังใช้ `baseColor: "stone"` อยู่ — สีจริงถูก override ใน `globals.css` แล้ว ดังนั้นปุ่ม/การ์ดจาก shadcn จะได้โทนน้ำตาลตาม theme |

### ถ้าจะมาแก้ UI ต่อ ต้องทำยังไง

| อยากแก้ | ไปที่ไฟล์/ขั้นตอน |
|--------|---------------------|
| **ข้อความบนหน้าแรก** (หัวข้อ,  paragraph, ปุ่ม) | แก้ใน `src/app/page.js` — หา `<h1>`, `<p>`, ข้อความใน section แล้วแก้ตรงนั้น |
| **สีทั้งโปรเจกต์** (โทนน้ำตาล, สีปุ่ม, พื้นหลัง) | แก้ใน `src/app/globals.css` ในบล็อก `:root` — เปลี่ยนค่า `--primary`, `--background`, `--foreground`, `--muted`, `--accent` ฯลฯ (ใช้รูปแบบ oklch หรือ hex ตามที่ theme รองรับ). ถ้าเพิ่มสีใหม่ ให้เพิ่มใน `:root` และใน `@theme inline` เป็น `--color-ชื่อสี` |
| **รูปภาพ Hero (ถ้วยกาแฟ)** | ใส่รูปในโฟลเดอร์ `public/` (เช่น `public/hero-coffee.png`). ใน `src/app/page.js` ในส่วน Hero ด้านขวา แทนที่ `<div>…☕</div>` ด้วย `<Image src="/hero-coffee.png" alt="..." width={400} height={400} />` และ `import Image from "next/image"` |
| **เมนูบน Header** (เพิ่ม/ลด/เปลี่ยนลิงก์) | แก้ใน `src/app/components/Header.jsx` — แก้ array `navLinks` หรือปุ่ม/ลิงก์ด้านขวา (Search, Cart, Signup). ถ้าเพิ่ม route ใหม่ที่ต้องล็อกอิน ต้องไปเพิ่ม path ใน `src/lib/constants.js` (PROTECTED_PATHS) ด้วย |
| **โลโก้** | แก้ใน `src/app/components/Header.jsx` — ส่วน `<Link href="/">` ด้านซ้าย: เปลี่ยนข้อความ "KAFUNG" / "coffee bar" หรือเปลี่ยนไอคอน ☕ เป็น `<img>` ถ้ามีไฟล์โลโก้ |
| **เพิ่ม section ในหน้าแรก** (เช่น Reviews, Gallery) | เปิด `src/app/page.js` — เพิ่ม `<section>` ใหม่ใต้หรือเหนือ section ที่มีอยู่ ใช้โครงแบบ "Our Delicious Services" (หัวข้อ + grid การ์ด) ได้. ถ้าให้ลิงก์จาก Header ไปถึง section ใช้ `id="reviews"` แล้วลิงก์เป็น `href="#reviews"` |
| **ปุ่ม/การ์ด/ฟอร์มจาก shadcn** | รัน `npx shadcn@latest add button` (หรือ card, input ฯลฯ) โค้ดจะไปที่ `src/components/ui/` หรือตามที่ตั้งใน `components.json`. สีจะตาม theme ใน `globals.css` อัตโนมัติ |
| **เวลาเปิดบริการ (แถบด้านบน)** | แก้ใน `src/app/page.js` — หา `<p className="text-center ...">` ในส่วน "Dark brown top band" แล้วแก้ข้อความตรงนั้น |

แก้เสร็จแล้วรัน `pnpm dev` ดูผลที่ [http://localhost:3000](http://localhost:3000) ถ้าแก้หลายจุด แนะนำให้ commit ทีละส่วนแล้วค่อยอัปเดต README (ตาราง [Pages](#pages), [What each file does](#what-each-file-does-added-for-features--tests)) ให้ตรงกับโปรเจกต์

---

## สารบัญ (Table of Contents)

| หัวข้อ | ลิงก์ |
|--------|--------|
| **สรุปภาษาไทย (สำหรับเพื่อน)** | **[สรุปโปรเจกต์](#สรุปโปรเจกต์-สำหรับเพื่อน)** |
| **รองรับการขยาย (เพิ่มหน้า/DB/config/component)** | **[รองรับการขยายโปรเจกต์ไหม](#รองรับการขยายโปรเจกต์ไหม-เมื่อทำตาม-srs)** |
| **แก้ UI / แก้ต่อ (ธีม, Landing, Header)** | **[การแก้ไข UI ที่ทำไปแล้ว + วิธีแก้ต่อ](#การแก้ไข-ui-ที่ทำไปแล้ว--วิธีแก้ต่อ)** |
| สรุปโปรเจกต์ (EN) | [Summary](#summary) |
| วิธีเริ่มต้น | [Quick Start](#quick-start) |
| คำสั่งใน package.json | [Scripts](#scripts) |
| **คำสั่ง CLI แบบละเอียด (Next, Lint, Prisma, Vitest, shadcn)** | **[CLI Reference](#cli-reference)** |
| แต่ละไฟล์ทำอะไร | [What each file does](#what-each-file-does-added-for-features--tests) |
| โครงสร้างโปรเจกต์ | [Project Structure](#project-structure) |
| หน้าเว็บ | [Pages](#pages) |
| API | [API Reference](#api-reference-crud) |
| Unit Tests | [Unit Tests (Vitest)](#unit-tests-vitest) |
| ตัวแปรแวดล้อม | [Environment Variables](#environment-variables) |
| Prisma | [Adding Persistence](#adding-persistence-prisma) |
| Path Alias | [Path Alias](#path-alias) |
| Tech Stack | [Tech Stack](#tech-stack) |

---

## Summary

| Area | Description |
|------|-------------|
| **App** | Home, Login, Menu, Order pages; middleware protects `/menu` and `/order` with `auth-token` cookie. |
| **API** | REST CRUD for `/api/menu` and `/api/orders` (ready to plug in Prisma). |
| **Business logic** | Pricing (base + options + member discount + promotion + VAT), offline order queue, inventory/BOM, pickup scheduling, loyalty points & tiers. |
| **Tests** | Vitest + React Testing Library; tests for all of the above logic and API validation. |

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

**ถ้า `pnpm run dev` หรือ `pnpm dev` ไม่ได้ (เช่น `next: command not found`):** ให้รัน `pnpm install` ก่อนในโฟลเดอร์ `my-app` เพื่อติดตั้ง dependencies แล้วค่อยรัน `pnpm dev` อีกครั้ง

---

## Scripts

| Command       | Description                    |
|--------------|---------------------------------|
| `pnpm dev`   | Start dev server (Turbopack)    |
| `pnpm build` | Build for production            |
| `pnpm start` | Run production build             |
| `pnpm lint`  | Run ESLint (Next.js lint)       |
| `pnpm test`  | Run unit tests (watch)          |
| `pnpm test:run` | Run unit tests once          |
| `pnpm test:ui`  | Run tests with Vitest UI     |
| `pnpm test:coverage` | Run tests with coverage report |

---

<a id="cli-reference"></a>

## CLI Reference (คำสั่งใช้งานแต่ละเครื่องมือ)

เพื่อนที่ clone โปรเจกต์สามารถใช้คำสั่งด้านล่างได้เลย (รันในโฟลเดอร์ `my-app`)

### 1. Next.js

| คำสั่ง | ความหมาย | ตัวอย่าง |
|--------|----------|----------|
| รันผ่าน script | ใช้ตามที่กำหนดใน `package.json` | ดูหัวข้อ Scripts ด้านบน |
| รันโดยตรง (npx) | ไม่ต้องพึ่ง script | เหมือนกัน ถ้าไม่มี script ให้ใช้แบบนี้ |

```bash
# Development (โหมดพัฒนา — รันแล้วเปิด http://localhost:3000)
pnpm dev
# หรือ
npx next dev --turbopack

# Build สำหรับ production
pnpm build
# หรือ
npx next build --turbopack

# รันหลัง build แล้ว (production mode)
pnpm start
# หรือ
npx next start

# ตรวจสอบว่า build ผ่านไหม (ไม่รันเซิร์ฟเวอร์)
npx next build
```

**หมายเหตุ:** โปรเจกต์ใช้ `--turbopack` อยู่แล้ว ถ้าเพื่อนรัน `npx next dev` โดยไม่ใส่ flag จะได้ webpack แทน (ช้ากว่า)

---

### 2. ESLint (Next.js lint)

ใช้ตรวจโค้ดให้ตรงมาตรฐานและ best practice ของ Next.js

```bash
# รัน lint ทั้งโปรเจกต์ (ตามที่ตั้งใน package.json)
pnpm lint
# หรือ
npx next lint

# lint เฉพาะโฟลเดอร์หรือไฟล์
npx next lint --dir src/app
npx next lint --file src/lib/pricing.js

# แก้ไขอัตโนมัติได้ (ถ้ารองรับ)
npx next lint --fix
```

** config:** ใช้ `eslint.config.mjs` และ `next/core-web-vitals` (ดูใน `eslint.config.mjs`)

---

### 3. Prisma

ใช้เมื่อต่อฐานข้อมูล PostgreSQL และมีไฟล์ `prisma/schema.prisma` แล้ว

```bash
# สร้างโฟลเดอร์ prisma และไฟล์ schema.prisma (ครั้งแรกเท่านั้น)
npx prisma init

# สร้าง Prisma Client หลังแก้ schema (ต้องรันทุกครั้งที่แก้ schema)
npx prisma generate

# อัปเดต DB ตาม schema (ไม่ใช้ migration file)
npx prisma db push

# สร้าง migration และอัปเดต DB (ใช้เมื่ออยากเก็บ history การเปลี่ยน schema)
npx prisma migrate dev --name init

# เปิด Prisma Studio ดู/แก้ข้อมูลใน DB ผ่าน browser
npx prisma studio

# รัน migration ใน production
npx prisma migrate deploy

# รีเซ็ต DB (ลบข้อมูลแล้ว apply migration ใหม่) — ใช้ระวัง
npx prisma migrate reset
```

**ต้องมี:** ตัวแปร `DATABASE_URL` ใน `.env` หรือ `.env.local` (ดูใน `.env.example`)

---

### 4. Vitest (Unit Test)

ใช้รัน unit test ทั้งโปรเจกต์

```bash
# โหมด watch — รันเทสแล้วรันใหม่ทุกครั้งที่แก้ไฟล์ (เหมาะตอนเขียนโค้ด)
pnpm test
# หรือ
npx vitest

# รันเทสครั้งเดียวแล้วจบ (เหมาะกับ CI หรือเช็คก่อน commit)
pnpm test:run
# หรือ
npx vitest run

# รันเทสแล้วเปิด UI ใน browser
pnpm test:ui
# หรือ
npx vitest --ui

# รันเทสพร้อมรายงาน coverage
pnpm test:coverage
# หรือ
npx vitest run --coverage
```

**รันเทสเฉพาะไฟล์หรือชื่อเทส:**

```bash
# รันเฉพาะไฟล์
npx vitest run src/lib/pricing.test.js

# รันเทสที่ชื่อตรงกับคำค้น (pattern)
npx vitest run -t "Pricing Engine"

# watch เฉพาะไฟล์
npx vitest src/lib/pricing.test.js
```

** config:** `vitest.config.mjs` — ใช้ environment `jsdom`, รันไฟล์ `src/**/*.test.{js,jsx}`, path alias `@` → `src/`

---

### 5. shadcn/ui

ใช้เพิ่มหรืออัปเดต UI component จาก shadcn (Button, Card, Input ฯลฯ)

```bash
# เริ่มใช้ shadcn ในโปรเจกต์ (ครั้งแรก — จะถาม style, base color, etc.)
npx shadcn@latest init

# เพิ่ม component (เลือกจาก list)
npx shadcn@latest add button

# เพิ่มหลายตัวในคำสั่งเดียว
npx shadcn@latest add button card input

# ดู component ที่มีให้เพิ่ม
npx shadcn@latest add

# อัปเดต component ที่มีอยู่แล้ว
npx shadcn@latest add button --overwrite
```

**หมายเหตุ:** หลัง `add` โค้ดจะถูกเขียนลงในโปรเจกต์ (เช่น `src/components/ui/button.jsx`) เพื่อนสามารถแก้เองได้

---

### สรุปคำสั่งที่ใช้บ่อย

| งานที่ทำ | คำสั่ง |
|----------|--------|
| รันเว็บพัฒนา | `pnpm dev` |
| เช็คโค้ด (lint) | `pnpm lint` |
| รันเทสครั้งเดียว | `pnpm test:run` |
| รันเทสแบบ watch | `pnpm test` |
| Build ขึ้น production | `pnpm build` แล้ว `pnpm start` |
| ต่อ DB กับ Prisma | ใส่ `DATABASE_URL` ใน `.env` → `npx prisma generate` → `npx prisma db push` หรือ `migrate dev` |
| เพิ่มปุ่ม/การ์ดจาก shadcn | `npx shadcn@latest add button card` |

---

## What each file does (added for features & tests)

### Source (logic)

| File | Purpose |
|------|--------|
| `src/lib/constants.js` | Shared config: `PROTECTED_PATHS` for middleware; add paths here to protect new routes. |
| `src/lib/utils.js` | `cn()` — merges Tailwind class names (clsx + tailwind-merge). |
| `src/lib/pricing.js` | **Pricing engine**: subtotal (base + options), member discount (role-based), promotion (percent/fixed), VAT 7%, and full pipeline `calculateOrderTotal()`. |
| `src/lib/offline-db.js` | **Offline queue**: add orders to queue (localStorage), get pending, update status (synced/failed), clear after sync. Used when `navigator.onLine` is false. |
| `src/hooks/useSyncQueue.js` | Re-exports offline-db helpers for components; can be extended to trigger sync when online. |
| `src/lib/date-utils.js` | **Order scheduling**: check if time is within operating hours (e.g. 07:00–18:00), block past time, lead time (e.g. 15 min), holiday/closure list, and `validatePickupTime()`. |
| `src/lib/loyalty.js` | **Membership**: points earned (e.g. 10 THB = 1 point), update accumulated points, tier by spend (Bronze/Silver/Gold), redemption validation and `redeemPoints()`. |
| `src/services/inventoryService.js` | **Inventory / BOM**: get required ingredients per product variant and quantity, check stock before order, deduct stock, aggregate requirements for multiple items; used for “Out” transactions. |

### Test files

| File | What it tests |
|------|----------------|
| `src/lib/utils.test.js` | `cn()` — merge classes, conditionals, Tailwind override. |
| `src/lib/constants.test.js` | `PROTECTED_PATHS` contains `/menu`, `/order` and is a valid array. |
| `src/lib/pricing.test.js` | Pricing engine: base+options, member/vip discount, promotion %, fixed, VAT, full pipeline. |
| `src/lib/offline-db.test.js` | Offline queue: add when offline, pending status, update synced/failed, clear after sync, conflict handling. |
| `src/lib/date-utils.test.js` | Scheduling: operating hours, past block, lead time, holidays, `validatePickupTime()`. |
| `src/lib/loyalty.test.js` | Loyalty: points earned, accumulated points, tier upgrade, redemption validation. |
| `src/services/inventoryService.test.js` | BOM: required ingredients, prevent order when low stock, deduct exact amount, Out transaction, aggregate. |
| `src/app/api/menu/route.test.js` | Menu API: GET returns items array; POST 400 when name/price missing, 201 with body when valid. |
| `src/app/components/Header.test.jsx` | Header: renders brand “KAFUNG”, “coffee bar”, LOGIN button, cart button. |

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
│   │   ├── date-utils.js       # Order scheduling, business hours
│   │   ├── offline-db.js       # Offline queue (localStorage)
│   │   ├── loyalty.js         # Points & tiers
│   │   ├── pricing.js         # POS pricing & discount engine
│   │   └── utils.js            # cn() for Tailwind
│   ├── hooks/
│   │   └── useSyncQueue.js    # Offline sync facade
│   ├── services/
│   │   └── inventoryService.js # BOM & stock deduction
│   └── middleware.js          # Auth check for /menu, /order
├── .env.example
├── jsconfig.json              # Path alias: @/* → ./src/*
├── next.config.mjs
├── package.json
├── vitest.config.mjs          # Vitest: jsdom, include src/**/*.test.{js,jsx}, @ alias
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

## Unit Tests (Vitest)

### What is Vitest and why use it

- **Vitest** is a unit test runner that uses the same config as Vite (fast, ESM-native). It is the recommended choice for unit testing Next.js apps (see [Next.js Testing guide](https://nextjs.org/docs/app/guides/testing/vitest)).
- **Principles**: Tests run in isolation; each `describe` groups related scenarios, each `it`/`test` asserts one behaviour. We use **jsdom** so DOM APIs (e.g. `localStorage`, `navigator`) exist; we use **@testing-library/react** for component tests.
- **Convention**: Test files live next to or near the code they test, with the name `*.test.js` or `*.test.jsx`. The config only runs `src/**/*.test.{js,jsx}`.

### How to run tests

```bash
pnpm install          # install deps (vitest, jsdom, @testing-library/*)
pnpm test             # watch mode — re-runs on file change
pnpm test:run         # run once (e.g. for CI)
pnpm test:ui          # open Vitest UI in browser
pnpm test:coverage    # run once and output coverage report
```

- **Watch mode** (`pnpm test`): Leave it running while developing; tests re-run when you save.
- **Single run** (`pnpm test:run`): Use in CI or to get a quick pass/fail.
- **Config**: `vitest.config.mjs` sets `environment: "jsdom"`, `include: ["src/**/*.test.{js,jsx}]`, and path alias `@` → `src/`.

### Test topics and feature coverage

| Topic | Test file | Feature IDs | What is tested |
|-------|-----------|--------------|----------------|
| **Pricing engine** | `src/lib/pricing.test.js` | MNU-02, MNU-03, TC-01, TC-02 | Base price + options (Milk, Sweetness, Topping); normal vs member/vip price; promotion (percentage and fixed); VAT 7%; full pipeline from base to total. |
| **Offline sync & queue** | `src/lib/offline-db.test.js` | PRF-01, PRF-05, TC-09, TC-10, TC-11 | Add order to queue when offline; order has `pending` status; get pending for sync; mark as synced/failed (e.g. conflict / out of stock); clear queue after successful sync. |
| **Inventory & BOM** | `src/services/inventoryService.test.js` | INV-01, TC-22, TC-26 | Required ingredients for a product variant and quantity; prevent order if any ingredient is below required; deduct exact amount from stock; “Out” transaction log; aggregate requirements for multiple items. |
| **Order scheduling** | `src/lib/date-utils.test.js` | CUS-02, TC-15 | Time within store hours (e.g. 07:00–18:00); block past date/time; lead time (e.g. 15 min in advance); holiday/closure dates; full `validatePickupTime()`. |
| **Membership & loyalty** | `src/lib/loyalty.test.js` | MEM-01, TC-28, TC-29 | Points earned (e.g. 10 THB = 1 point); update accumulated points; tier upgrade (Bronze → Silver → Gold) by spend threshold; redemption validation (cannot redeem more than available). |
| **Utils & constants** | `src/lib/utils.test.js`, `src/lib/constants.test.js` | — | `cn()` merge and Tailwind behaviour; `PROTECTED_PATHS` content and shape. |
| **Menu API** | `src/app/api/menu/route.test.js` | — | GET returns `{ items }`; POST validation (400 when name/price missing), 201 and body when valid. |
| **Header component** | `src/app/components/Header.test.jsx` | — | Renders brand, subtitle, LOGIN button, cart button. |

### Quick reference: test commands

| Command | Use case |
|---------|----------|
| `pnpm test` | Development — watch and re-run on save |
| `pnpm test:run` | CI or one-off run |
| `pnpm test:ui` | Visual UI to run/filter tests |
| `pnpm test:coverage` | Coverage report |

---

## Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|----------|-------------|
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
- **Vitest** (unit tests), **jsdom**, **@testing-library/react**
- **Prisma** (optional, for DB)
- **Zod** (validation)
- **shadcn/ui** (components)
