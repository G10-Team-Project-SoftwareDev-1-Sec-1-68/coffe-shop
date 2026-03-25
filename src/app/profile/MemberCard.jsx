"use client";
import * as React from "react";

export default function MemberCard({ user }) {
  // ฟังก์ชันช่วยจัดรูปแบบตัวเลขแต้ม
  const formatPoints = (num) => {
    return num.toLocaleString(); // 2450 -> 2,450
  };

  return (
    <div className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,165,0,0.3)] border border-white/20 mb-10 text-white relative overflow-hidden">
      
      {/* เอฟเฟกต์แสงเงาพรีเมียม */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-coffee-dark/70 text-sm font-bold italic">สมาชิก KAFUNG</p>
          
          {/* 🟢 ดึงชื่อจากฐานข้อมูล */}
          <h2 className="text-coffee-dark font-black text-3xl uppercase tracking-tighter leading-none mb-1">
            {user.name}
          </h2>
          
          {/* 🟢 ดึงเบอร์โทรศัพท์จากฐานข้อมูล */}
          <p className="text-coffee-dark/60 text-sm font-mono tracking-widest font-bold">
            ID: {user.phone}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-coffee-dark/70 text-sm font-bold italic mb-[-5px]">แต้มสะสม</p>
          <div className="flex items-baseline justify-end gap-2">
            
            {/* 🟢 ดึงแต้มจากฐานข้อมูล */}
            <span className="text-coffee-dark font-black text-7xl italic tracking-tighter leading-none">
              {formatPoints(user.points)}
            </span>
            <span className="text-coffee-dark font-black text-2xl italic uppercase">แต้ม</span>
          </div>
          
          {/* 🟢 ดึงวันหมดอายุจากฐานข้อมูล */}
          <p className="text-coffee-dark/50 text-[10px] font-bold italic mt-2">
            แต้มหมดอายุ : {user.expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}