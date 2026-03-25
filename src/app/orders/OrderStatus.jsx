"use client";
import * as React from "react";

export default function OrderStatus() {
  return (
    <div className="w-full py-4">
      {/* Container หลัก: ใช้ grid 3 คอลัมน์เพื่อให้ทุกอย่างเท่ากันและจุดกลางอยู่กึ่งกลางพอดี */}
      <div className="relative grid grid-cols-3 w-full">
        
        {/* ── เส้นพื้นหลัง (ลากยาวผ่านทุกจุด) ── */}
        <div className="absolute top-[16px] left-[15%] right-[15%] h-[2px] bg-gray-200 z-0"></div>
        
        {/* จุดที่ 1: รับออเดอร์แล้ว (อยู่ซ้าย) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full border-[6px] border-white shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
          <span className="text-[10px] font-bold text-[#4A3427] italic whitespace-nowrap">รับออเดอร์แล้ว</span>
        </div>

        {/* จุดที่ 2: กำลังจัดเตรียม (อยู่กึ่งกลางเส้นพอดี 🎯) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* ถ้าเนมอยากให้จุดกลางเป็นสีเขียวแทน ให้เปลี่ยน bg-gray-300 เป็น bg-green-500 นะครับ */}
          <div className="w-8 h-8 bg-gray-300 rounded-full border-[6px] border-white shadow-sm"></div>
          <span className="text-[10px] font-bold text-gray-400 italic whitespace-nowrap">กำลังจัดเตรียม</span>
        </div>

        {/* จุดที่ 3: พร้อมรับสินค้า (อยู่ขวา) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full border-[6px] border-white shadow-sm"></div>
          <span className="text-[10px] font-bold text-gray-400 italic whitespace-nowrap">พร้อมรับสินค้า</span>
        </div>

      </div>
    </div>
  );
}