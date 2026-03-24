"use client";
import * as React from "react";
import { Home, ClipboardList, UserCircle } from "lucide-react";
import Link from "next/link"; // 🟢 เพิ่ม Link สำหรับเชื่อมโยงกลับหน้าหลัก
import Header from "../components/Header";
import OrderStatus from "./OrderStatus"; // Import ส่วนสถานะ
import OrderHistory from "./OrderHistory"; // Import ส่วนประวัติ

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#C49A83] pb-40 relative">
      <Header />

      <main className="max-w-[1100px] mx-auto pt-24 px-8">
        {/* แถบหัวข้อ สถานะคำสั่งซื้อ */}
        <div className="bg-white rounded-full py-3 px-10 shadow-md mb-8 inline-block w-full text-center">
          <span className="text-[#4A3427] font-black text-xl italic uppercase tracking-tight">สถานะคำสั่งซื้อ</span>
        </div>

        {/* ส่วนประกอบที่แยกไฟล์ออกมา */}
        <OrderStatus />
        <OrderHistory />
      </main>

      {/* --- 🧭 Floating Bottom Nav --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl h-20 rounded-[3rem] shadow-2xl flex items-center justify-around px-10 border border-white/5 text-white">
          
          {/* 🟢 ปุ่มหน้าหลัก: ใส่ Link เพื่อให้กดแล้วกลับไปหน้าเมนู */}
          <Link href="/menu-2" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 hover:text-coffee-gold transition-all">
            <Home size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">หน้าหลัก</span>
          </Link>

          {/* ปุ่มคำสั่งซื้อ (Active หน้านี้) */}
          <button className="flex flex-col items-center gap-1 text-coffee-gold cursor-default">
            <ClipboardList size={28} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tighter">คำสั่งซื้อของฉัน</span>
          </button>

          {/* ปุ่มโปรไฟล์ */}
          <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
            <UserCircle size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">โปรไฟล์</span>
          </button>
          
        </div>
      </div>

      <style jsx global>{`
        * { font-family: 'Playpen Sans', cursive !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}