"use client";
import * as React from "react";
import { Home, ClipboardList, UserCircle, Clock } from "lucide-react";
import Link from "next/link"; 
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import OrderStatus from "./OrderStatus"; 
import OrderHistory from "./OrderHistory"; 

export default function OrderPage() {
  const searchParams = useSearchParams();
  
  // 🟢 ดึงข้อมูลจาก URL (ที่ส่งมาจากหน้าตะกร้า)
  const itemsOrdered = searchParams.get('items') || "Hot Espresso";
  const dateOrdered = searchParams.get('date') || "25 มี.ค. 2569";
  const timeOrdered = searchParams.get('time') || "14:44";
  const totalAmount = searchParams.get('total') || "0.00";

  return (
    <div className="min-h-screen bg-[#C49A83] pb-40 relative">
      <Header basketCount={0} />

      <main className="max-w-[1100px] mx-auto pt-32 px-8">
        {/* หัวข้อสถานะด้านบนสุด */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full py-3 px-12 shadow-xl border border-white/20">
            <span className="text-[#4A3427] font-black text-xl italic uppercase tracking-tighter">สถานะคำสั่งซื้อ</span>
          </div>
        </div>

        {/* 📄 Card หลักอันเดียว (ลบอันซ้อนออกแล้ว) */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-l-[15px] border-coffee-gold">
          
          {/* ส่วนรายละเอียดออเดอร์ปัจจุบัน */}
          <div className="space-y-1 mb-8">
            <h2 className="text-[#4A3427] font-black italic text-3xl uppercase tracking-tighter leading-none">ORDER _</h2>
            <p className="text-[#4A3427] font-bold italic text-lg opacity-80">
              {dateOrdered} | {timeOrdered}
            </p>
            <div className="pt-2 flex gap-2">
              <span className="text-[#4A3427] font-black italic text-xl">รายการ : </span>
              <span className="text-[#4A3427] font-bold italic text-xl">
                {itemsOrdered}
              </span>
            </div>
          </div>

          {/* ปุ่มสถานะดุ๊กดิ๊ก */}
          <div className="flex items-center gap-3 bg-[#FDF8F1] text-coffee-gold px-6 py-3 rounded-full w-fit mb-10 border border-coffee-gold/20 shadow-sm">
            <Clock size={22} className="animate-pulse" />
            <span className="font-black italic uppercase text-sm tracking-widest">กำลังเตรียมเมนูของคุณ</span>
          </div>

          {/* 🟢 เส้นสถานะ (Timeline) - เรียกใช้ OrderStatus ที่ลบชื่อ Cocoa ออกแล้ว */}
          <div className="px-4 py-8 bg-gray-50/40 rounded-[2rem] mb-10 border border-gray-100">
             <OrderStatus />
          </div>

          {/* 🟢 ยอดรวมสุทธิของออเดอร์นี้ */}
          <div className="flex justify-between items-center mb-10 px-4">
            <span className="text-[#4A3427] font-black italic text-xl uppercase">ยอดรวมสุทธิ</span>
            <span className="text-[#4A3427] font-black italic text-4xl">฿ {totalAmount}</span>
          </div>

          {/* 🟢 ส่วนรายการที่เคยสั่ง (Order History) อยู่ท้ายสุดของ Card */}
          <div className="mt-10 pt-10 border-t border-dashed border-gray-200">
            <OrderHistory />
          </div>
          
        </div>
      </main>

      {/* --- 🧭 Floating Bottom Nav --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl h-20 rounded-[3rem] shadow-2xl flex items-center justify-around px-10 text-white">
          <Link href="/menu-2" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
            <Home size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">หน้าหลัก</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-coffee-gold scale-105 transition-all">
            <ClipboardList size={28} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tighter">คำสั่งซื้อ</span>
          </button>
          <Link href="/profile" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
            <UserCircle size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">โปรไฟล์</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </div>
  );
}