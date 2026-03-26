"use client";
import * as React from "react";
import { Minus, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation"; 
import Header from "../components/Header"; 
import Toast from "../components/Toast";
import { useCartStore } from "../store/cartStore";
import { addToQueue, isOnline } from "@/lib/offline-db";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, updateQuantity, clearCart } = useCartStore();
  
  const [paymentMethod, setPaymentMethod] = React.useState('QR_CODE'); 
  const [usePoints, setUsePoints] = React.useState(false); 
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState({ message: "", type: "success" });

  const subtotal = getTotalPrice();
  const total = Math.max(0, subtotal - (usePoints ? 50 : 0));

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      variantId: item.variant.id,
      quantity: item.quantity,
      priceAtTime: item.price,
      options: { 
        display: item.selectedOptions,
        optionIds: item.optionIds 
      } 
    }));

    // Check if offline
    if (!isOnline()) {
      try {
        const offlineOrder = {
          orderNumber: `OFFLINE-${Date.now()}`,
          type: "POS", // Use POS type for easier syncing/testing
          totalAmount: total,
          pickupMethod: "SELF_PICKUP",
          isOffline: true,
          items: orderItems,
          payment: {
            method: "CASH",
            status: "COMPLETED",
            amount: total,
            paidAt: new Date().toISOString()
          },
          createdAt: new Date().toISOString()
        };

        await addToQueue(offlineOrder);
        setToast({ message: "คุณอยู่ในโหมดออฟไลน์: ออเดอร์ถูกบันทึกลงเครื่องแล้ว กรุณาไปที่หน้า POS เพื่อซิงก์ข้อมูลเมื่อมีเน็ต", type: "success" });
        clearCart();
        setTimeout(() => router.push("/pos"), 2000);
        return;
      } catch (err) {
        setToast({ message: "ไม่สามารถบันทึกออเดอร์ออฟไลน์ได้: " + err.message, type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // 2. Call API to create order (Normal flow)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ONLINE",
          totalAmount: total,
          items: orderItems,
          pickupMethod: "SELF_PICKUP"
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถสร้างคำสั่งซื้อได้");
      }

      clearCart();
      router.push(`/orders`);
      
    } catch (error) {
      setToast({ message: error.message, type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] pb-24">
      <Header />
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      )}
      <main className="max-w-3xl mx-auto pt-32 px-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black italic text-[#3D2B1F] tracking-tighter uppercase">ตะกร้าสินค้า</h1>
          {cartItems.length > 0 && (
            <button onClick={() => { if(confirm("ลบทั้งหมด?")) clearCart() }} className="text-[#B87C4C] text-sm font-bold bg-[#B87C4C]/10 px-4 py-2 rounded-full uppercase hover:bg-red-50 hover:text-red-500 transition-all">
              ลบทั้งหมด
            </button>
          )}
        </div>

        {/* รายการสินค้า */}
        <div className="space-y-4">
          {cartItems.length > 0 ? cartItems.map((item) => (
            <div key={item.uniqueId} className="bg-white rounded-3xl p-4 flex gap-4 items-center shadow-sm border border-[#E5D5C6]/50">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
                <img src={item.product?.image || item.image || "/menu-images/hot-espresso.png"} alt="product" className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-[#3D2B1F] font-black italic text-lg leading-tight uppercase truncate">
                  {item.product?.name || item.nameEn || item.nameTh}
                </h3>
                <p className="text-gray-400 text-[10px] font-bold mb-2 truncate">
                  {item.selectedOptions}
                </p>
                <div className="flex justify-between items-end">
                  <span className="text-[#B87C4C] font-black italic text-lg leading-none mt-1">฿ {Number(item.price * item.quantity).toFixed(0)}</span>
                  <div className="bg-[#FDF8F1] border border-[#E5D5C6]/50 rounded-full flex items-center gap-3 px-3 py-1.5 shrink-0 shadow-inner">
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)} className="text-[#B87C4C]"><Minus size={14} strokeWidth={4} /></button>
                    <span className="font-black text-sm w-4 text-center text-[#3D2B1F]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)} className="text-[#B87C4C]"><Plus size={14} strokeWidth={4} /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-3xl py-16 text-center border border-dashed border-[#E5D5C6] shadow-sm">
               <span className="text-gray-400 italic font-bold">ไม่มีรายการสินค้าในตะกร้า</span>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            {/* ส่วนการจ่ายเงิน (Mockup UI Info) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5D5C6]/50 space-y-4">
              <h3 className="text-[#3D2B1F] font-black italic uppercase">วิธีการชำระเงิน</h3>
              <p className="text-sm text-gray-500 font-medium">คุณสามารถสแกน QR Code ชำระเงินได้ที่แท็บคำสั่งซื้อ หลังจากกดปุ่มยืนยัน</p>
              <div className="bg-[#FDF8F1] w-full rounded-2xl p-4 flex justify-between items-center border border-[#B87C4C]">
                <div className="text-left font-black italic text-[#B87C4C]">Thai QR PromptPay</div>
                <div className="w-5 h-5 bg-[#B87C4C] rounded-full flex items-center justify-center"><Check size={12} className="text-white" strokeWidth={4} /></div>
              </div>
            </div>

            {/* ยอดรวม */}
            <div className="bg-[#3D2B1F] rounded-[2.5rem] p-6 shadow-2xl mt-8">
              <div className="flex justify-between items-center text-white mb-6 px-2">
                <span className="font-bold text-lg">ยอดสุทธิ</span>
                <span className="text-3xl font-black italic tracking-tighter">฿ {total.toFixed(0)}</span>
              </div>
              <button 
                onClick={handleConfirmOrder} 
                disabled={isSubmitting} 
                className="w-full bg-[#B87C4C] text-white py-5 rounded-full font-black italic text-xl shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-wide border border-white/20"
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
              </button>
            </div>
          </>
        )}
      </main>

      <style jsx global>{`
        * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </div>
  );
}