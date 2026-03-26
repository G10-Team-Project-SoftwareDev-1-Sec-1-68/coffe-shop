"use client";
import * as React from "react";
import { Home, ClipboardList, UserCircle } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header";
import MemberCard from "./MemberCard";
import RewardItems from "./RewardItems";

export default function ProfilePage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  async function fetchUser() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF5ED] pb-40 relative">
      <Header />

      <main className="max-w-[1100px] mx-auto pt-24 px-8">

        {loading ? (
          /* Loading skeleton for MemberCard */
          <div className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] p-8 rounded-[2.5rem] mb-10 animate-pulse h-44" />
        ) : user ? (
          <MemberCard user={user} />
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 mb-10 shadow-lg text-center text-coffee-dark font-bold text-lg italic">
            กรุณาเข้าสู่ระบบเพื่อดูบัตรสมาชิก
          </div>
        )}

        <RewardItems userPoints={user?.points ?? 0} onRedeemSuccess={fetchUser} />
      </main>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-coffee-dark/95 backdrop-blur-xl h-20 rounded-[3rem] shadow-2xl flex items-center justify-around px-10 border border-white/5 text-white">
          <Link href="/menu" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all">
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