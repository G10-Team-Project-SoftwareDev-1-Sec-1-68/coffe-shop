"use client";
import * as React from "react";
import { Home, ClipboardList, UserCircle } from "lucide-react";
import Link from "next/link"; 
import Header from "../components/Header";
import OrderStatus from "./OrderStatus"; 
import OrderHistory from "./OrderHistory"; 

export default function OrderPage() {
  const [basketCount, setBasketCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#C49A83] pb-40 relative">
      {/* 🛒 รถเข็นจะอยู่ใน Header นี้ เนมต้องไปเช็คไฟล์ Header.jsx ด้วยนะครับว่าใส่ Link ไป /cart หรือยัง */}
      <Header basketCount={basketCount} />

      <main className="max-w-[1100px] mx-auto pt-32 px-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full py-3 px-12 shadow-xl border border-white/20">
            <span className="text-[#4A3427] font-black text-xl italic uppercase tracking-tighter">
              สถานะคำสั่งซื้อ
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatus />
          <OrderHistory />
        </div>
      </main>

      {/* --- 🧭 Floating Bottom Nav --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl h-20 rounded-[3rem] shadow-2xl flex items-center justify-around px-10 border border-white/5 text-white">
          
          {/* หน้าหลัก */}
          <Link href="/menu-2" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all group">
            <Home size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-tighter">หน้าหลัก</span>
          </Link>

          {/* คำสั่งซื้อของฉัน (Active) */}
          <Link href="/orders" className="flex flex-col items-center gap-1 text-coffee-gold scale-105 transition-all">
            <ClipboardList size={28} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tighter">คำสั่งซื้อของฉัน</span>
          </Link>

          {/* โปรไฟล์ */}
          <Link href="/profile" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 hover:text-coffee-gold transition-all group">
            <UserCircle size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-tighter">โปรไฟล์</span>
          </Link>
          
        </div>
      </div>

      <style jsx global>{`
        * { font-family: 'Playpen Sans', cursive !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}