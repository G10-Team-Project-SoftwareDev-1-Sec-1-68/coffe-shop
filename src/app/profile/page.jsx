"use client";
import * as React from "react";
import { Home, ClipboardList, UserCircle } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header";
import MemberCard from "./MemberCard";
import RewardItems from "./RewardItems";

export default function ProfilePage() {
  // 🟢 ข้อมูลที่ดึงมาจากฐานข้อมูล (Database Mockup)
  const DB_USER = {
    name: "คุณเนม",
    phone: "081-234-5678",
    points: 2450,
    expiryDate: "31-12-2026"
  };

  return (
    <div className="min-h-screen bg-[#FDF5ED] pb-40 relative">
      <Header />
      
      <main className="max-w-[1100px] mx-auto pt-24 px-8">
        
        {/* ส่ง Object user ทั้งก้อนไปที่ MemberCard */}
        <MemberCard user={DB_USER} />
        
        <RewardItems />
      </main>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-coffee-dark/95 backdrop-blur-xl h-20 rounded-[3rem] shadow-2xl flex items-center justify-around px-10 border border-white/5 text-white">
          <Link href="/menu-2" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
            <Home size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">หน้าหลัก</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
            <ClipboardList size={28} />
            <span className="text-[9px] font-black uppercase tracking-tighter">คำสั่งซื้อ</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-coffee-gold">
            <UserCircle size={28} strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-tighter">โปรไฟล์</span>
          </button>
        </div>
      </div>
    </div>
  );
}