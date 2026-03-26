# 🛠️ คู่มือการแก้ไขปัญหาเบื้องต้น (Troubleshooting Guide)

หากคุณพบปัญหาในการรันโปรเจกต์ KAFUNG Coffee Bar ให้ตรวจสอบตามหัวข้อดังนี้:

## 1. รันโปรเจกต์ไม่ได้ / หาคำสั่งไม่เจอ (Command Not Found)
**สาเหตุ:** ยังไม่ได้ติดตั้ง dependencies หรือไฟล์ใน `node_modules` ไม่ครบ
**วิธีแก้:**
```bash
pnpm install
```
*ถ้ายังไม่ได้ติดตั้ง pnpm ให้รัน `npm install -g pnpm` ก่อน*

---

## 2. เชื่อมต่อฐานข้อมูลไม่ได้ (Database Connection Error)
**สาเหตุ:** Docker Desktop ยังไม่ได้เปิด หรือยังไม่ได้รัน Container ของ Postgres
**วิธีแก้:**
1. ตรวจสอบว่าเปิดโปรแกรม **Docker Desktop** แล้ว
2. รันคำสั่งเปิดฐานข้อมูล:
   ```bash
   docker compose up -d
   ```
3. ตรวจสอบสถานะว่ารันอยู่จริงไหม:
   ```bash
   docker compose ps
   ```

---

## 3. Error เกี่ยวกับตาราง (Table not found / Schema mismatch)
**สาเหตุ:** โครงสร้างฐานข้อมูลในเครื่องคุณไม่ตรงกับไฟล์ `schema.prisma`
**วิธีแก้:**
```bash
npx prisma generate
npx prisma db push
```

---

## 4. ล็อกอินไม่ได้ / ไม่มีข้อมูลสินค้า (No Data / Invalid Login)
**สาเหตุ:** ฐานข้อมูลว่างเปล่า ยังไม่มีข้อมูลตั้งต้น
**วิธีแก้:**
รันคำสั่ง Seed เพื่อสร้างบัญชี Admin, Staff และข้อมูลเมนู:
```bash
npx prisma db seed
```
*บัญชีเริ่มต้น:*
- **Admin:** `admin@kafung.com` / `hashed_password_here` (เปลี่ยนได้ใน seed.js)
- **Staff:** `staff@kafung.com` / `staff_password_123`

---

## 5. กราฟไม่แสดง / ข้อมูล Dashboard ว่าง
**สาเหตุ:** ยังไม่มีออเดอร์ในระบบ
**วิธีแก้:**
คุณสามารถใช้ Developer API เพื่อสร้างข้อมูลจำลองได้รวดเร็ว:
- เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/api/dev/mock-order` (เพื่อสร้างออเดอร์สุ่ม)
- เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/api/dev/add-stock` (เพื่อเติมสต็อกให้เต็ม)

---

## 6. ลืมตั้งค่า Environment Variables
**สาเหตุ:** ไฟล์ `.env` ยังไม่ได้สร้างหรือค่าไม่ถูกต้อง
**วิธีแก้:**
1. คัดลอกไฟล์ตัวอย่าง: `cp .env.example .env`
2. ตรวจสอบค่า `DATABASE_URL` ให้ตรงกับใน `docker-compose.yml`
