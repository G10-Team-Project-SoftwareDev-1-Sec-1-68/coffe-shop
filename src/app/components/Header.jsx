"use client";
import * as React from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Header() {
  // 🟢 ดึงจำนวนของในตะกร้ามาโชว์ที่ไอคอน
  const { cartItems } = useCartStore();
  const basketCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#FDF8F1]/80 backdrop-blur-md border-b border-[#E5D5C6]/30">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* 1. Logo Section (KAFUNG COFFEE BAR) */}
        <Link href="/menu-2" className="flex items-center gap-3 group">
          <div className="w-14 h-14 bg-[#B87C4C] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
             {/* ใส่รูปโลโก้จริงของเนมตรงนี้นะครับ */}
             <span className="text-2xl text-white">☕</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#3D2B1F] font-black italic text-2xl leading-none tracking-tighter uppercase">
              KAFUNG
            </h1>
            <span className="text-[#B87C4C] font-bold italic text-[10px] uppercase tracking-widest mt-0.5">
              COFFEE BAR
            </span>
          </div>
        </Link>

        {/* 2. Navigation Menu (ตรงกลาง) */}
        <nav className="hidden md:flex items-center gap-10">
          {["HOME", "SERVICES", "MENU", "REVIEWS"].map((item) => (
            <Link 
              key={item} 
              href={item === "MENU" ? "/menu-2" : "#"} 
              className="text-[#6B5E55] font-black italic text-sm tracking-widest hover:text-[#B87C4C] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* 3. Action Buttons (Search, Cart, Sign Up) */}
        <div className="flex items-center gap-6">
          
          {/* ปุ่มค้นหา */}
          <button className="text-[#3D2B1F] hover:text-[#B87C4C] transition-colors">
            <Search size={24} strokeWidth={2.5} />
          </button>

          {/* ปุ่มตะกร้า (มีตัวเลขแจ้งเตือน) */}
          <Link href="/cart" className="relative text-[#3D2B1F] hover:text-[#B87C4C] transition-colors">
            <ShoppingCart size={24} strokeWidth={2.5} />
            {basketCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {basketCount}
              </span>
            )}
          </Link>

          {/* ปุ่มสมัครสมาชิก (ดีไซน์ตามรูปเป๊ะ) */}
          <Link 
            href="/register" 
            className="bg-[#3D2B1F] text-[#FDF8F1] px-8 py-3 rounded-full font-black italic text-sm tracking-tighter hover:bg-[#2D1B11] transition-all shadow-xl active:scale-95"
          >
            สมัครสมาชิก
          </Link>

        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        header * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </header>
  );
}