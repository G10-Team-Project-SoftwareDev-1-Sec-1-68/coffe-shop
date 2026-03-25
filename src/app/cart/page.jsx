"use client";
import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header"; 
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  // 🟢 ดึงฟังก์ชันเพิ่ม/ลด (updateQuantity) และลบทั้งหมด (clearCart) จาก Store
  const { cartItems, getTotalPrice, updateQuantity, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = React.useState('qr');
  
  const subtotal = getTotalPrice();
  const discount = 0.00; 
  const total = subtotal - discount;

  // 🗑️ ฟังก์ชันลบทั้งหมดแบบมีคอนเฟิร์ม
  const handleClearAll = () => {
    if (window.confirm("ต้องการลบรายการทั้งหมดในตะกร้าใช่หรือไม่?")) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#C49A83]">
      <Header />

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6 space-y-6">
        
        {/* 🏷️ แถบหัวข้อ + ปุ่มลบทั้งหมด */}
        <div className="bg-white rounded-full px-10 py-3 flex justify-between items-center shadow-lg">
          <span className="font-bold italic text-[#4A3427] text-xl uppercase tracking-tighter">ตะกร้าสินค้า</span>
          
          {/* 🔴 ปุ่มลบทั้งหมด (ตามที่เนมต้องการ) */}
          <button 
            onClick={handleClearAll}
            className="text-[#B87C4C] text-xs font-bold italic uppercase hover:text-red-500 transition-all flex items-center gap-1"
          >
            <Trash2 size={14} /> ลบทั้งหมด
          </button>
        </div>

        {/* 📋 รายการสินค้า */}
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
                    <h3 className="text-[#4A3427] font-bold italic text-2xl uppercase leading-none tracking-tighter">
                      {item.nameEn || item.nameTh}
                    </h3>
                    
                    <p className="text-[12px] text-gray-500 font-medium italic mt-1 leading-tight">
                      {item.description || "เมนูพิเศษจาก KAFUNG"} 
                    </p>
                    
                    <p className="text-[10px] text-coffee-gold font-bold italic mt-1 uppercase tracking-tight">
                      {item.selectedOptions}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-[#B38E3F] font-bold italic text-2xl leading-none">
                      ฿ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    {/* ➕➖ ตัวปรับจำนวน (ตามรูปที่เนมส่งมา) */}
                    <div className="bg-[#F1F3F4] rounded-full flex items-center gap-4 px-4 py-2 shadow-inner">
                      
                      {/* ปุ่มลดจำนวน (-) : ถ้าลดจนเหลือ 0 รายการจะหายไปเอง */}
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                        className="text-[#4A3427] active:scale-125 transition-transform"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      
                      <span className="font-bold text-lg min-w-[20px] text-center text-[#4A3427]">
                        {item.quantity}
                      </span>
                      
                      {/* ปุ่มเพิ่มจำนวน (+) */}
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                        className="text-[#4A3427] active:scale-125 transition-transform"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 rounded-[2.5rem] py-24 text-center border-2 border-dashed border-white/20">
              <p className="text-white font-bold italic uppercase text-xl opacity-60">ไม่มีสินค้าในตะกร้า</p>
              <Link href="/menu-2" className="text-white underline mt-4 block text-sm italic">กลับไปเลือกเมนู</Link>
            </div>
          )}
        </div>

        {/* 💳 ส่วนแต้มสะสม */}
        <div className="bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-xl border-l-[15px] border-[#B38E3F]">
          <div className="flex flex-col">
            <span className="font-bold italic text-base text-[#4A3427]">ใช้ 50 แต้มแลกส่วนลด</span>
            <span className="text-xs text-gray-400 font-bold italic mt-1 uppercase">คุณเนม มี 50 แต้ม</span>
          </div>
          <div className="w-8 h-8 rounded-full border-4 border-gray-100 bg-gray-50 shadow-inner"></div>
        </div>

        {/* ยอดรวมเงิน */}
        <div className="px-6 py-8 space-y-2 text-white border-t border-white/20">
          <div className="flex justify-between text-sm font-bold italic uppercase opacity-70 tracking-widest">
            <span>ยอดรวมสินค้า</span>
            <span>฿ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold italic uppercase text-red-100 tracking-widest">
            <span>ส่วนลด</span>
            <span>- ฿ {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-4xl font-bold italic uppercase tracking-tighter pt-3 border-t border-white/10">
            <span>ยอดสุทธิ</span>
            <span>฿ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* ปุ่มยืนยัน (กดแล้วไปหน้าชำระเงิน) */}
        <button 
          disabled={cartItems.length === 0}
          className="w-full bg-[#332C26] text-white py-6 rounded-[2.5rem] font-bold italic uppercase text-2xl shadow-2xl active:scale-[0.97] transition-all mt-6 border border-white/10 hover:bg-[#2D1B11] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ยืนยันคำสั่งซื้อ
        </button>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        * { font-family: 'Playpen Sans', cursive !important; }
        h1, h2, h3, h4, span, p, button {
          font-style: italic;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}