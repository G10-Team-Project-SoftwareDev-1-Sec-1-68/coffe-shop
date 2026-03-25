"use client";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function MenuCard({ item, onClick }) {
  // 🟢 ฟังก์ชันช่วยเช็คว่าจะแสดงชื่อไหนตามประเภท (Type)
  // ถ้าเป็น bakery หรือ others ให้ใช้ nameTh 
  // นอกนั้นใช้ nameEn (และถ้าไม่มี nameEn จริงๆ ก็ให้ถอยกลับไปใช้ nameTh เพื่อกันเหนียว)
  const displayName = (item.type === "bakery" || item.type === "others") 
    ? item.nameTh 
    : (item.nameEn || item.nameTh);

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 w-full max-w-4xl mx-auto mb-3 p-4 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98] cursor-pointer group"
    >
      
      {/* 1. รูปภาพสินค้า */}
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#F5F5F5] shadow-inner">
        <Image 
          src={item.image} 
          alt={displayName} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
          priority 
        />
      </div>
      
      {/* 2. รายละเอียดตรงกลาง */}
      <div className="flex-grow flex flex-col justify-center overflow-hidden pl-1">
        
        {/* ☕ ชื่อเมนู: แก้ไขเงื่อนไขแยกตาม Type เรียบร้อย */}
        <h3 className="text-[#4A3427] font-black text-lg md:text-xl leading-tight mb-1 truncate uppercase italic">
          {displayName}
        </h3>
        
        {/* คำอธิบายสั้นๆ */}
        <p className="text-muted-foreground text-[10px] md:text-xs leading-snug line-clamp-1 italic mb-2 opacity-70">
          {item.descTh}
        </p>
        
        {/* ฿ ราคา */}
        <div className="flex items-baseline gap-1 text-[#B87C4C]">
           <span className="font-bold text-xs mb-[1px]">฿</span>
           <span className="font-black text-base md:text-lg tracking-tighter leading-none">
             {item.price}
           </span>
        </div>
      </div>

      {/* 3. ปุ่มกดเพิ่ม (เครื่องหมายบวก) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // กันไม่ให้กดโดน Card ซ้อนกัน
          onClick();
        }}
        className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 bg-[#F5F5F5] rounded-full flex items-center justify-center shadow-md text-coffee-dark border border-gray-100 transition-all hover:bg-coffee-gold hover:text-white hover:scale-110 active:scale-90"
      >
        <Plus size={22} strokeWidth={3.5} />
      </button>
      
    </div>
  );
}