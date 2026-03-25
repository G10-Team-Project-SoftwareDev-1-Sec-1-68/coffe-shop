"use client";
import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, LogOut, User } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Header() {
  // 🟢 ดึงจำนวนของในตะกร้ามาโชว์ที่ไอคอน
  const { cartItems } = useCartStore();
  const basketCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState(null); // null = ยังโหลด, false = ไม่ได้ login

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? false))
      .catch(() => setUser(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  }

  const displayName = user
    ? user.firstName + (user.lastName ? ` ${user.lastName}` : "")
    : null;

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

          {/* Auth section */}
          {user === null ? (
            // Loading skeleton
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#E5D5C6]" />
          ) : user ? (
            // Logged-in: แสดงชื่อ + logout
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#E5D5C6] bg-white px-4 py-2 shadow-sm">
                <User className="h-4 w-4 text-[#B87C4C]" />
                <span className="text-sm font-bold text-[#3D2B1F] max-w-[120px] truncate uppercase tracking-wide">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 px-4 py-2 text-sm font-bold transition hover:bg-red-100 uppercase tracking-widest"
                aria-label="ออกจากระบบ"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            // Not logged in: แสดงปุ่ม login + register ดีไซน์ใหม่
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-[#B87C4C] border border-[#B87C4C] px-6 py-2.5 rounded-full font-black italic text-sm tracking-tighter hover:bg-[#B87C4C] hover:text-white transition-all active:scale-95"
              >
                LOG IN
              </Link>
              <Link 
                href="/register" 
                className="bg-[#3D2B1F] text-[#FDF8F1] px-8 py-3 rounded-full font-black italic text-sm tracking-tighter hover:bg-[#2D1B11] transition-all shadow-xl active:scale-95"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        header * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </header>
  );
}