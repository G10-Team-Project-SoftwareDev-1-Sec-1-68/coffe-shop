"use client";
import * as React from "react";
import { Minus, Plus, Wallet, CreditCard, Store, Check } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header"; 
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  const { cartItems, getTotalPrice, getTotalItems } = useCartStore();
  const [paymentMethod, setPaymentMethod] = React.useState('qr');
  
  const subtotal = getTotalPrice();
  const discount = 0.00; 
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-[#C49A83]">
      {/* 🟢 ใช้ Header ตัวหลักที่เหมือนหน้าหลักที่สุด */}
      <Header />

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6 space-y-6">
        
        {/* แถบหัวข้อ: ตัวหนา เอียง (สไตล์เดียวกับเมนูใน Header) */}
        <div className="bg-white rounded-full px-10 py-3 flex justify-between items-center shadow-lg">
          <span className="font-bold italic text-[#4A3427] text-xl uppercase tracking-tighter">ตะกร้าสินค้า</span>
          <button className="text-[#B87C4C] text-xs font-bold italic uppercase hover:opacity-70 transition-all">ลบทั้งหมด</button>
        </div>

        {/* 📋 รายการสินค้า: ใส่รายละเอียด คำอธิบาย กลับมาให้ครบตามรูป */}
        <div className="space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.uniqueId} className="bg-white rounded-[2.5rem] p-6 flex gap-6 items-center shadow-xl border border-white/20">
                {/* รูปสินค้า */}
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 shadow-inner">
                  <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
                </div>
                
                {/* รายละเอียด */}
                <div className="flex-1 flex flex-col justify-between h-24 py-1">
                  <div>
                    {/* 🟢 ชื่อเมนู: ตัวหนา เอียง พิมพ์ใหญ่ เหมือนในรูปหน้าหลักเป๊ะ */}
                    <h3 className="text-[#4A3427] font-bold italic text-2xl uppercase leading-none tracking-tighter">
                      {item.nameEn || item.nameTh}
                    </h3>
                    
                    {/* 🟢 รายละเอียด/คำอธิบายเมนู (ที่หายไป): เอียง และจางลงนิดนึง */}
                    <p className="text-[12px] text-gray-500 font-medium italic mt-1 leading-tight">
                      {item.description || "เอสเพรสโซ่ร้อน เข้มข้น หอมกรุ่นต้นตำรับ"} 
                    </p>
                    
                    {/* ออปชันที่เลือก: ขนาด, นม, ความหวาน */}
                    <p className="text-[10px] text-coffee-gold font-bold italic mt-1 uppercase tracking-tight">
                      {item.selectedOptions}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto">
                    {/* ราคา: ตัวหนา เอียง สีทอง */}
                    <span className="text-[#B38E3F] font-bold italic text-2xl leading-none">
                      ฿ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    {/* ตัวปรับจำนวนสไตล์ Android */}
                    <div className="bg-[#F1F3F4] rounded-full flex items-center gap-4 px-4 py-2 shadow-inner">
                      <button className="text-[#4A3427]"><Minus size={16} strokeWidth={3} /></button>
                      <span className="font-bold text-lg min-w-[20px] text-center text-[#4A3427]">{item.quantity}</span>
                      <button className="text-[#4A3427]"><Plus size={16} strokeWidth={3} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 rounded-[2.5rem] py-24 text-center border-2 border-dashed border-white/20">
              <p className="text-white font-bold italic uppercase text-xl opacity-60">ไม่มีสินค้าในตะกร้า</p>
            </div>
          )}
        </div>

        {/* 💳 ส่วนชำระเงิน และ แต้ม (ดีไซน์ตามรูป Android ล่าสุด) */}
        <div className="bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-xl border-l-[15px] border-[#B38E3F]">
          <div className="flex flex-col">
            <span className="font-bold italic text-base text-[#4A3427]">ใช้ 50 แต้มแลกส่วนลด</span>
            <span className="text-xs text-gray-400 font-bold italic mt-1 uppercase">คุณเนม มี 50 แต้ม</span>
          </div>
          <div className="w-8 h-8 rounded-full border-4 border-gray-100 bg-gray-50 shadow-inner"></div>
        </div>

        {/* ยอดสรุปเงิน */}
        <div className="px-6 py-8 space-y-2 text-white border-t border-white/20">
          <div className="flex justify-between text-sm font-bold italic uppercase opacity-70 tracking-widest">
            <span>ยอดรวมสินค้า</span>
            <span>฿ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold italic uppercase text-red-100 tracking-widest">
            <span>ส่วนลด</span>
            <span>- ฿ {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-4xl font-bold italic uppercase tracking-tighter pt-3">
            <span>ยอดสุทธิ</span>
            <span>฿ {total.toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full bg-[#332C26] text-white py-6 rounded-[2.5rem] font-bold italic uppercase text-2xl shadow-2xl active:scale-[0.97] transition-all mt-6 border border-white/10 hover:bg-[#2D1B11]">
          ยืนยันคำสั่งซื้อ
        </button>
      </main>

      {/* 🟢 🎯 บังคับใช้ฟอนต์ตัวเอียงพรีเมียมแบบหน้าหลัก */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        
        * { 
          font-family: 'Playpen Sans', cursive !important; 
        }
        
        /* ปรับให้ฟอนต์ดูหนาและเอียงคมชัดเหมือนรูปหน้าหลัก */
        h1, h2, h3, h4, span, p, button {
          font-style: italic;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}