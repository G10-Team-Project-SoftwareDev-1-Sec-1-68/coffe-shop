"use client";
import * as React from "react";
import { RotateCcw } from "lucide-react";

const HISTORY_DATA = [
  { id: "001", date: "24 มี.ค. 2026", time: "15:45", menu: "Thai Tea", price: 80 },
  { id: "002", date: "23 มี.ค. 2026", time: "09:20", menu: "Hot Latte", price: 75 },
];

export default function OrderHistory() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#4A3427] font-black text-3xl italic uppercase tracking-tighter mb-6 px-2">ประวัติคำสั่งซื้อ</h2>
      
      {HISTORY_DATA.map((item) => (
        <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-lg flex justify-between items-center border border-white/10 active:scale-95 transition-transform">
          <div className="space-y-1">
            <h4 className="text-[#4A3427] font-black text-base italic uppercase">Order _</h4>
            <p className="text-muted-foreground text-xs font-bold italic">{item.date} {item.time}</p>
            <p className="text-[#4A3427] font-black text-lg leading-tight">{item.menu}</p>
            <p className="text-coffee-gold font-black text-xl italic mt-1">฿ {item.price}</p>
          </div>
          <button className="bg-[#E5E5E5] p-4 rounded-full text-[#4A3427] hover:bg-coffee-gold hover:text-white transition-all shadow-sm">
            <RotateCcw size={24} strokeWidth={3} />
          </button>
        </div>
      ))}
    </div>
  );
}