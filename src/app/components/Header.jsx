"use client";
import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, LogOut, User, ClipboardList } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Header() {
  const { cartItems } = useCartStore();
  const basketCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState(null); 
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || false);
        } else {
          setUser(false);
        }
      } catch (err) {
        setUser(false);
      }
    }
    checkAuth();

    const handleClickOutside = () => setShowDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const displayName = user ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#FDF8F1]/80 backdrop-blur-md border-b border-[#E5D5C6]/30">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* 1. Logo Section (KAFUNG COFFEE BAR) */}
        <Link href="/" className="flex items-center gap-3 group">
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
          {[{label: "HOME", href: "/"}, {label: "SERVICES", href: "/#services"}, {label: "MENU", href: "/menu"}, {label: "REVIEWS", href: "/#reviews"}].map(({label, href}) => (
            <Link 
              key={label} 
              href={href} 
              className="text-[#6B5E55] font-black italic text-sm tracking-widest hover:text-[#B87C4C] transition-colors"
            >
              {label}
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
            // Logged-in: Dropdown Menu
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full border border-[#E5D5C6] bg-white px-4 py-2 shadow-sm hover:border-[#B87C4C] transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#B87C4C] flex items-center justify-center text-white">
                  <User size={14} strokeWidth={3} />
                </div>
                <span className="text-sm font-bold text-[#3D2B1F] max-w-[100px] truncate uppercase tracking-wide">
                  {user.firstName}
                </span>
              </button>

              {/* Dropdown Content */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-[#E5D5C6]/50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-4 py-2 text-[10px] font-black text-[#B87C4C] uppercase tracking-widest border-b border-[#E5D5C6]/30 mb-1">
                    ยินดีต้อนรับ, {user.firstName}
                  </p>
                  
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#3D2B1F] hover:bg-[#FDF8F1] hover:text-[#B87C4C] transition-colors underline-none">
                    <User size={18} />
                    <span>โปรไฟล์สมาชิก</span>
                  </Link>
                  
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#3D2B1F] hover:bg-[#FDF8F1] hover:text-[#B87C4C] transition-colors underline-none">
                    <ClipboardList size={18} />
                    <span>ประวัติการสั่งซื้อ</span>
                  </Link>

                  <div className="border-t border-[#E5D5C6]/30 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              )}
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