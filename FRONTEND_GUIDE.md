# ☕ คู่มือสำหรับ Frontend Developer (User / POS / Admin)

เอกสารนี้สรุปสิ่งที่เพิ่งอัปเดตไปในฝั่ง Frontend เพื่อให้คนที่รับผิดชอบหน้า **`/order` (User)**, **`/pos` (Staff)**, และ **`/dashboard` (Admin)** สามารถทำงานต่อและทดสอบระบบได้ง่ายขึ้น

---

## 🧭 1. ระบบ Role-Based Routing (การนำทางตามสิทธิ์)

ระบบตอนนี้มีการป้องกัน Route (Route Protection) ผ่าน `middleware.js` แล้ว โดยจะผูก Role ของ User เข้ากับหน้าหลักของแต่ละคน:

- **`CUSTOMER`** ➔ เข้าได้แค่ `/order` (ถ้าไปเข้าหน้าอื่นจะเด้งกลับมานี่)
- **`STAFF`** ➔ เข้าได้แค่ `/pos`
- **`ADMIN`** ➔ เข้าได้แค่ `/dashboard`
- *(ทุกคนเข้า `/menu` ได้ถ้า Login แล้ว)*

**💡 พฤติกรรมของระบบ:**
- หากยังไม่ Login แล้วเปิดหน้าพวกนี้ จะโดนเตะไปหน้า `/login`
- หาก Login แล้ว และเป็น `CUSTOMER` แต่พยายามพิมพ์ URL ไปเข้า `/pos` ระบบจะเตะกลับมาที่ `/order` ทันที

---

## 🔑 2. ระบบ Login & Register (แปรสภาพเรียบร้อย)

หน้า `/login` และ `/register` เขียนเชื่อมกับ API จริงเสร็จแล้ว:
- **Register (`/register`):** บังคับใส่ชื่อ (firstName), อีเมล, และรหัสผ่าน
- **เมื่อสมัครเสร็จ:** ระบบจะ Login ให้ทันที (ได้ Token) และ Redirect ไปที่หน้า **`/order`** พร้อมมี Toast Notification เด้งต้อนรับ 
- **เมื่อ Login เสร็จ:** ระบบจะอ่านว่าเราเป็น Role อะไร แล้ว Redirect ไปหน้าที่ถูกต้องอัตโนมัติ

---

## 🧪 3. วิธีทดสอบหน้า POS และ Dashboard ของตัวเอง

ค่าเริ่มต้น (Default) เวลาสมัครสมาชิกใหม่ผ่านหน้าเว็บ ทุกคนจะได้ Role เป็น **`CUSTOMER`** เสมอ ทำให้หลังสมัครเสร็จจะไหลไปที่หน้า `/order`

หากคุณคือคนที่ทำหน้า **`/pos` (พนักงาน)** หรือ **`/dashboard` (แอดมิน)** และต้องการเข้าหน้านั้นเพื่อทดสอบ UI ของตัวเอง ให้ทำตามขั้นตอนนี้:

### ขั้นตอนการเปลี่ยน Role 
1. **สมัครสมาชิกปกติ:** เปิดเบราว์เซอร์ไปที่ `http://localhost:3000/register` แล้วสร้างบัญชีของคุณเอง
2. **เปิด Database:** เนื่องจากโปรเจกต์เราใช้ PostgreSQL ผ่าน Docker คุณสามารถแก้ข้อมูลได้ 2 ทาง:
   - **วิธีที่ 1: ผ่าน Prisma Studio (ง่ายสุด แนะนำ!)**
     - เปิด Terminal พิมพ์คำสั่ง: `npx prisma studio`
     - เบราว์เซอร์จะเด้งขึ้นมา เลือกตาราง `User`
     - หาชื่อที่คุณเพิ่งสมัครไป ดับเบิลคลิกที่ช่อง `role` แถวนั้น
     - เปลี่ยนจาก `CUSTOMER` เป็น `STAFF` (หรือ `ADMIN`) แล้วกด Save (สีเขียว)
   - **วิธีที่ 2: ผ่าน pgAdmin**
     - เข้า pgAdmin ที่รันอยู่ เชื่อมต่อ Database ของแอพ
     - ไปที่ตาราง `User` กด View/Edit Data
     - แก้คอลัมน์ `role` เป็น `STAFF` หรือ `ADMIN` แล้วกด Save (รูปแผ่นดิสก์)
3. **Login ใหม่ (🔥 สำคัญมาก):** 
   - กลับมาที่หน้าเว็บ กดปุ่ม **"ออกจากระบบ"** (อยู่บน Header มุมขวาบน)
   - Login ใหม่เข้าสู่ระบบด้วยบัญชีเดิม 
   - *สาเหตุที่ต้อง Login ใหม่เพราะ Role ถูกฝังอยู่ใน JWT Token ถ้าไม่ Login ใหม่เพื่อดึง Token ใหม่ Middleware จะยังคิดว่าคุณเป็น CUSTOMER อยู่*
4. **สำเร็จ! 🎉:** หลัง Login รอบนี้ ระบบจะตรวจสอบ Token แล้วเด้งคุณไปที่ `/pos` หรือ `/dashboard` ทันที และคุณสามารถเขียนโค้ดหน้านั้นต่อได้เลย

---

## 🔔 4. ระบบ Toast Notification
เรามี Component สำหรับโชว์ข้อความแจ้งเตือนมุมขวาบนให้ใช้แล้ว!

**วิธีใช้งานในหน้าของคุณ:**
```jsx
// 1. Import hook
import { useState } from "react";
import Toast from "@/app/components/Toast";

// 2. ใช้งานใน Component
export default function YourPage() {
  const [toast, setToast] = useState({ message: "", type: "success" });

  return (
    <div>
      {/* 3. วาง Component โชว์ Toast */}
      {toast.message && (
        <Toast 
           message={toast.message} 
           type={toast.type} // "success" | "error" | "info"
           onClose={() => setToast({ message: "", type: "success" })} 
        />
      )}

      {/* ตัวอย่างปุ่มเรียก Toast */}
      <button onClick={() => setToast({ message: "บันทึกข้อมูลแล้ว!", type: "success" })}>
        กดเซฟ
      </button>
    </div>
  )
}
```

ถ้ามีปัญหาตรงไหนสอบถามได้เลยครับ! 🚀
