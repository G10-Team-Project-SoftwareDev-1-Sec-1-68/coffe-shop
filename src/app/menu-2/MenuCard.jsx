"use client";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function MenuCard({ item }) {
  return (
    <div className="flex items-center gap-5 w-full max-w-4xl mx-auto mb-4 p-5 rounded-[2.5rem] bg-[var(--card)] border border-border/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] cursor-pointer group">
      
      {/* 1. รูปภาพสินค้า (Compact Size 100x100) */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden flex-shrink-0 shadow-inner bg-[#F5F5F5]">
        <Image 
          src={item.image} 
          alt={item.nameEn || item.nameTh} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
          priority 
        />
      </div>
      
      {/* 2. รายละเอียดตรงกลาง */}
      <div className="flex-grow flex flex-col justify-center overflow-hidden">
        {/* ชื่อเมนู: ขนมโชว์ไทย / กาแฟโชว์อังกฤษ */}
        <h3 className="text-xl md:text-2xl font-bold text-[var(--coffee-dark)] mb-1 truncate tracking-tight uppercase italic">
          {item.type === "bakery" ? item.nameTh : item.nameEn}
        </h3>
        
        <p className="text-muted-foreground text-sm md:text-base leading-snug line-clamp-1 italic">
          {item.descTh}
        </p>
        
        {/* ราคาพรีเมียมสี Tan Brown */}
        <div className="flex items-center gap-1.5 mt-2">
           <span className="text-[#B87C4C] font-black text-lg">฿</span>
           <span className="text-[#B87C4C] font-black text-2xl tracking-tighter">{item.price}</span>
        </div>
      </div>

      {/* 3. ปุ่มกดเพิ่ม (เครื่องหมายบวก) */}
      <button className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md text-coffee-dark border border-border/20 transition-all hover:bg-[var(--primary)] hover:text-white hover:scale-110 active:scale-90">
        <Plus size={28} strokeWidth={3} />
      </button>
      
    </div>
  );
}