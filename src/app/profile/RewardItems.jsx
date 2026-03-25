"use client";
import * as React from "react";
import { Ticket, Gift } from "lucide-react";

const REWARDS_DATA = [
  {
    id: 1,
    icon: Ticket,
    titleTh: "ส่วนลด 50 บาท",
    descTh: "คูปองส่วนลดแทนเงินสด ใช้ได้กับทุกเมนู",
    points: 50
  },
  {
    id: 2,
    icon: Gift,
    titleTh: "Premium Product",
    descTh: "Limited Edition - แก้ว KAFUNG Collection",
    points: 200
  },
];

export default function RewardItems() {
  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-coffee-dark font-black text-2xl italic uppercase mb-6 px-1 tracking-tight">
        ของรางวัลแนะนำ
      </h2>
      
      {REWARDS_DATA.map((item) => (
        <div key={item.id} className="bg-white rounded-[2.5rem] p-6 shadow-lg flex justify-between items-center border border-coffee-dark/5 active:scale-95 transition-all">
          <div className="flex items-center gap-6 overflow-hidden">
            {/* 🖼️ ส่วนไอคอน */}
            <div className="bg-[#EAEAEA] p-5 rounded-[1.8rem] text-coffee-gold border border-black/5 flex items-center justify-center min-w-[85px] min-h-[85px] flex-shrink-0">
              <item.icon size={40} strokeWidth={2.5} />
            </div>
            
            {/* ✍️ ส่วนรายละเอียด */}
            <div className="flex flex-col justify-center overflow-hidden">
              <h4 className="text-coffee-dark font-black text-2xl italic tracking-tighter leading-none mb-1">
                {item.titleTh}
              </h4>
              
              {/* รายละเอียดบรรทัดเดียว */}
              <p className="text-muted-foreground text-[12px] font-bold italic leading-snug mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.descTh}
              </p>
              
              {/* 🟢 ปรับลดขนาดแต้มลง (จาก 3xl เหลือ xl) เพื่อความสวยงาม */}
              <div className="flex items-baseline gap-1">
                <span className="text-coffee-gold font-black text-xl italic leading-none">
                  ใช้ {item.points}
                </span>
                <span className="text-coffee-gold font-bold text-sm italic uppercase">แต้ม</span>
              </div>
            </div>
          </div>

          {/* 🔘 ปุ่มแลก */}
          <button className="flex-shrink-0 ml-4 bg-coffee-dark p-3.5 rounded-full text-white font-black text-sm uppercase italic tracking-wider px-8 hover:bg-coffee-gold hover:text-coffee-dark transition-all shadow-md">
            แลก
          </button>
        </div>
      ))}
    </div>
  );
}