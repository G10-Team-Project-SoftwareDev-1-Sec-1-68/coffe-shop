"use client";
import * as React from "react";

export default function OrderStatus() {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl mb-10 border border-white/20">
      <div className="mb-6">
        <h3 className="text-[#4A3427] font-black text-lg italic uppercase tracking-tighter">Order _</h3>
        <p className="text-muted-foreground text-sm font-bold italic leading-none">25 มี.ค. 2026 | 10:30</p>
        <p className="text-[#4A3427] font-black text-base mt-2">รายการ : Iced Cocoa</p>
      </div>

      <hr className="border-t-2 border-[#F0F0F0] mb-10" />

      {/* Stepper Status */}
      <div className="relative flex justify-between items-center px-4">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-[#E5E5E5] z-0"></div>
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.8)] border-4 border-white"></div>
          <span className="text-[10px] font-black text-[#4A3427] text-center w-20 leading-tight">รับออเดอร์แล้ว</span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D9D9D9] border-4 border-white"></div>
          <span className="text-[10px] font-black text-muted-foreground text-center w-20 leading-tight opacity-50">กำลังจัดเตรียม</span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D9D9D9] border-4 border-white"></div>
          <span className="text-[10px] font-black text-muted-foreground text-center w-20 leading-tight opacity-50">พร้อมรับสินค้า</span>
        </div>
      </div>
    </div>
  );
}