"use client";
import * as React from "react";

// แสดงสีของแต่ละ tier
const TIER_STYLES = {
  BRONZE: { label: "BRONZE", bg: "bg-amber-700/20", text: "text-amber-800" },
  SILVER: { label: "SILVER", bg: "bg-slate-400/20", text: "text-slate-700" },
  GOLD: { label: "GOLD", bg: "bg-yellow-400/30", text: "text-yellow-900" },
};

export default function MemberCard({ user }) {
  const formatPoints = (num) => Number(num).toLocaleString();

  // คำนวณวันหมดอายุแต้ม = updatedAt + 1 ปี (fallback เป็นปีหน้า)
  const expiryDate = React.useMemo(() => {
    const base = user?.updatedAt ? new Date(user.updatedAt) : new Date();
    base.setFullYear(base.getFullYear() + 1);
    return base.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [user?.updatedAt]);

  const tier = TIER_STYLES[user?.memberTier] ?? TIER_STYLES.BRONZE;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "สมาชิก";

  return (
    <div className="bg-gradient-to-br from-[#FFC93C] via-[#FF9A3E] to-[#F24E1E] p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(242,78,30,0.4)] border border-white/30 mb-12 text-white relative overflow-hidden group">

      {/* เอฟเฟกต์แสงเงาพรีเมียม */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[90px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-coffee-dark/80 text-xs font-black italic uppercase tracking-widest">สมาชิก KAFUNG</p>

          {/* 🟢 ชื่อจริงจาก DB */}
          <h2 className="text-coffee-dark font-[1000] text-4xl uppercase tracking-tighter leading-tight mb-1 drop-shadow-sm">
            {fullName}
          </h2>

          {/* 🟢 เบอร์โทร / ID จาก DB */}
          <p className="text-coffee-dark/70 text-base font-bold tracking-tight">
            {user?.phone ? `ID: ${user.phone}` : `ID: ${user?.id?.slice(0, 8).toUpperCase()}`}
          </p>

          {/* 🟢 Badge tier */}
          <div className="pt-2">
            <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-[1000] uppercase tracking-[0.2em] shadow-sm border border-white/20 ${tier.bg} ${tier.text}`}>
              {tier.label}
            </span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <p className="text-coffee-dark/80 text-xs font-[1000] italic uppercase tracking-widest mb-1">แต้มสะสม</p>
          <div className="flex items-baseline justify-end gap-1.5">
            {/* 🟢 แต้มจริงจาก DB */}
            <span className="text-coffee-dark font-[1000] text-8xl italic tracking-tighter leading-[0.85] drop-shadow-md">
              {formatPoints(user?.points ?? 0)}
            </span>
            <span className="text-coffee-dark font-black text-2xl italic uppercase tracking-tighter">แต้ม</span>
          </div>

          {/* 🟢 วันหมดอายุแต้ม (คำนวณจาก updatedAt) */}
          <p className="text-coffee-dark/60 text-[10px] font-black italic mt-4 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 text-right">
            แต้มหมดอายุ : {expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}