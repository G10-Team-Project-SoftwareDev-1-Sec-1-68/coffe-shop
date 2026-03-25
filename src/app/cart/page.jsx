"use client";
import * as React from "react";
import { Minus, Plus, Trash2, Check } from "lucide-react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import Header from "../components/Header"; 
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, updateQuantity, clearCart } = useCartStore();
  
  const [paymentMethod, setPaymentMethod] = React.useState('qr'); 
  const [usePoints, setUsePoints] = React.useState(false); 

  const subtotal = getTotalPrice();
  const total = Math.max(0, subtotal - (usePoints ? 50 : 0));

  // 🚀 ฟังก์ชันยืนยันการสั่งซื้อแบบส่งข้อมูลผ่าน URL
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;

    // 1. เตรียมข้อมูลรายการ (เช่น "Iced Cocoa, Espresso")
    const itemNames = cartItems.map(item => item.nameEn || item.nameTh).join(", ");
    
    // 2. เตรียมวันที่และเวลาปัจจุบัน
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateStr = now.toLocaleDateString('th-TH', options);
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

    // 3. ล้างตะกร้า
    clearCart();

    // 4. วาร์ปไปหน้า Orders พร้อมส่งข้อมูลไปทาง URL
    const query = new URLSearchParams({
      items: itemNames,
      date: dateStr,
      time: timeStr,
      total: total.toFixed(2)
    }).toString();

    router.push(`/orders?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#C49A83]">
      <Header />
      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6 space-y-6">
        <div className="bg-white rounded-full px-10 py-3 flex justify-between items-center shadow-lg">
          <span className="font-bold italic text-[#4A3427] text-xl uppercase tracking-tighter">ตะกร้าสินค้า</span>
          <button onClick={() => { if(confirm("ลบทั้งหมด?")) clearCart() }} className="text-[#B87C4C] text-xs font-bold italic uppercase hover:text-red-500 transition-all">
            ลบทั้งหมด
          </button>
        </div>

        {/* รายการสินค้า */}
        <div className="space-y-4">
          {cartItems.length > 0 ? cartItems.map((item) => (
            <div key={item.uniqueId} className="bg-white rounded-[2.5rem] p-6 flex gap-6 items-center shadow-xl border border-white/20">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                <img src={item.image} alt="product" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between h-24">
                <h3 className="text-[#4A3427] font-bold italic text-2xl uppercase tracking-tighter">{item.nameEn || item.nameTh}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[#B38E3F] font-bold italic text-2xl">฿ {(item.price * item.quantity).toFixed(2)}</span>
                  <div className="bg-[#F1F3F4] rounded-full flex items-center gap-4 px-4 py-2">
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}><Minus size={16} strokeWidth={3} /></button>
                    <span className="font-bold text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}><Plus size={16} strokeWidth={3} /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white/10 rounded-[2.5rem] py-20 text-center border-2 border-dashed border-white/20 text-white italic font-bold">ไม่มีสินค้าในตะกร้า</div>
          )}
        </div>

        {/* ส่วนแต้ม */}
        <button onClick={() => setUsePoints(!usePoints)} className={`w-full bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-xl border-l-[15px] transition-all ${usePoints ? "border-[#B38E3F]" : "border-gray-200"}`}>
          <div className="flex flex-col items-start"><span className="font-bold italic text-lg text-[#4A3427]">ใช้ 50 แต้มแลกส่วนลด</span><span className="text-xs text-gray-400 font-bold italic">คุณเนม มี 50 แต้ม</span></div>
          <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${usePoints ? "border-[#B38E3F] bg-[#B38E3F]" : "border-gray-100 bg-gray-50"}`}>{usePoints && <Check size={18} className="text-white" strokeWidth={4} />}</div>
        </button>

        {/* ส่วนการจ่ายเงิน */}
        <div className="space-y-3">
          <h3 className="text-white font-black italic text-lg uppercase px-4">วิธีการชำระเงิน</h3>
          {['qr', 'card', 'counter'].map((id) => (
            <button key={id} onClick={() => setPaymentMethod(id)} className={`bg-white w-full rounded-[1.5rem] p-5 flex justify-between items-center shadow-md border-4 transition-all ${paymentMethod === id ? "border-[#B38E3F]" : "border-transparent opacity-80"}`}>
              <div className="text-left font-black italic text-[#4A3427]">{id === 'qr' ? 'Thai QR Payment' : id === 'card' ? 'บัตรเครดิต / เดบิต' : 'ชำระที่เคาน์เตอร์'}</div>
              {paymentMethod === id && <div className="w-6 h-6 bg-[#B38E3F] rounded-full flex items-center justify-center"><Check size={14} className="text-white" strokeWidth={4} /></div>}
            </button>
          ))}
        </div>

        {/* ยอดรวม */}
        <div className="px-6 py-8 text-white border-t border-white/20 mt-10">
          <div className="flex justify-between text-4xl font-bold italic tracking-tighter"><span>ยอดสุทธิ</span><span>฿ {total.toFixed(2)}</span></div>
        </div>

        <button onClick={handleConfirmOrder} disabled={cartItems.length === 0} className="w-full bg-[#332C26] text-white py-6 rounded-[2.5rem] font-bold italic text-2xl shadow-2xl active:scale-[0.97] disabled:opacity-50">
          ยืนยันคำสั่งซื้อ
        </button>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@700&display=swap');
        * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </div>
  );
}