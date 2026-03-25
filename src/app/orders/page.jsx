"use client";
import * as React from "react";
import { Clock, CheckCircle2, Search, QrCode, CupSoda } from "lucide-react";
import Header from "../components/Header";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Step mapping for progress bar
const STATUS_STEPS = {
  PENDING: { label: "รอชำระเงิน", index: 0, color: "bg-blue-500" },
  PREPARING: { label: "กำลังชง", index: 1, color: "bg-amber-500" },
  READY: { label: "พร้อมเสิร์ฟ", index: 2, color: "bg-green-500" },
  COMPLETED: { label: "เสร็จสิ้น", index: 3, color: "bg-gray-400" },
  CANCELLED: { label: "ยกเลิกแล้ว", index: -1, color: "bg-red-500" },
};

function TrackingCard({ order }) {
  const step = STATUS_STEPS[order.status] || STATUS_STEPS.PENDING;
  
  const time = new Date(order.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-none">ORDER {order.orderNumber.split("-").pop()}</h2>
          <p className="text-sm font-bold text-gray-400 mt-1">{time}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider ${step.color}`}>
          {step.label}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {order.items.map((item, idx) => {
          let opts = item.options && typeof item.options === 'string' ? JSON.parse(item.options) : item.options;
          const displayOpts = opts?.display ? ` - ${opts.display}` : "";
          const pName = item.variant?.product?.name || "Unknown Product";
          const vName = item.variant?.name || "";
          
          return (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex gap-3">
                <span className="font-black text-gray-400">{item.quantity}x</span>
                <div>
                   <p className="font-bold text-gray-900">{pName} <span className="text-gray-500 font-normal">{vName}</span></p>
                   {opts?.display && <p className="text-xs text-gray-400 mt-0.5">{opts.display}</p>}
                </div>
              </div>
              <span className="font-black text-gray-900">฿{(parseFloat(item.priceAtTime) * item.quantity).toFixed(0)}</span>
            </div>
          );
        })}
      </div>

      {order.status === "PENDING" && (
        <div className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4 mb-8 border border-blue-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
            <QrCode size={24} />
          </div>
          <div>
            <p className="font-bold text-blue-900">โปรดชำระเงินที่เคาน์เตอร์</p>
            <p className="text-xs text-blue-700 mt-1">สแกนจ่ายหรือเงินสด แจ้งหมายเลขออเดอร์แก่พนักงานเพื่อเริ่มทำเครื่องดื่ม</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
        <div className="relative py-4">
          <div className="absolute top-[32px] left-[15%] right-[15%] h-1 bg-gray-100 z-0 rounded-full"></div>
          
          <div className="relative z-10 grid grid-cols-3 w-full">
            {[STATUS_STEPS.PENDING, STATUS_STEPS.PREPARING, STATUS_STEPS.READY].map((s, i) => {
              const active = step.index === i;
              const passed = step.index > i;
              
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-[4px] flex items-center justify-center shadow-sm transition-all duration-500 ${
                    active ? `${s.color} border-white shadow-lg scale-125 animate-pulse` : 
                    passed ? `bg-gray-900 border-white text-white` : `bg-gray-100 border-white`
                  }`}>
                    {passed && <CheckCircle2 size={16} />}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap transition-colors ${
                    active ? "text-gray-900" : 
                    passed ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center px-2">
        <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">ยอดรวมสุทธิ</span>
        <span className="font-black text-2xl text-gray-900">฿ {parseFloat(order.totalAmount).toFixed(0)}</span>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const { data, error, isLoading } = useSWR("/api/orders", fetcher, { refreshInterval: 5000 });

  const orders = data?.orders || [];
  
  // แบ่ง active กับ history
  const activeOrders = orders.filter(o => ["PENDING", "PREPARING", "READY"].includes(o.status));
  const historyOrders = orders.filter(o => ["COMPLETED", "CANCELLED"].includes(o.status));

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header />

      <main className="max-w-3xl mx-auto pt-24 px-4 sm:px-6"> 
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
            <CupSoda className="w-8 h-8 text-amber-700" />
            ติดตามสถานะ
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">คำสั่งซื้อของคุณจะได้รับการอัปเดตแบบเรียลไทม์</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-64 bg-white rounded-3xl animate-pulse shadow-sm"></div>
            <div className="h-64 bg-white rounded-3xl animate-pulse shadow-sm"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold bg-white rounded-3xl shadow-sm">
            เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ
          </div>
        ) : (
          <>
            {activeOrders.length > 0 ? (
              <div className="space-y-6 mb-12">
                {activeOrders.map(order => (
                  <TrackingCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl py-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 mb-12">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                   <Search className="w-8 h-8 text-gray-300" />
                 </div>
                 <h2 className="font-black text-xl text-gray-900">ไม่มีคำสั่งซื้อที่กำลังดำเนินการ</h2>
                 <p className="text-sm font-medium text-gray-400">ไปที่หน้าเมนูเพื่อสั่งเครื่องดื่มอร่อยๆ กันเถอะ</p>
              </div>
            )}

            {historyOrders.length > 0 && (
              <div>
                <h3 className="font-black text-gray-900 text-xl uppercase tracking-wider mb-6 px-2">ประวัติคำสั่งซื้อ</h3>
                <div className="space-y-4">
                  {historyOrders.map(order => {
                    const time = new Date(order.createdAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' });
                    const date = new Date(order.createdAt).toLocaleDateString("th-TH", { day: 'numeric', month: 'short' });
                    const isCancelled = order.status === "CANCELLED";
                    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <div key={order.id} className={`bg-white rounded-2xl p-5 border flex justify-between items-center transition-all ${isCancelled ? "border-red-100 opacity-70" : "border-gray-100 hover:shadow-md"}`}>
                        <div>
                          <p className="font-black text-gray-900 mb-1 leading-none">ORDER {order.orderNumber.split("-").pop()}</p>
                          <p className="text-xs font-bold text-gray-400">{date} {time} • {itemCount} รายการ</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-lg ${isCancelled ? "text-red-500 line-through" : "text-gray-900"}`}>฿{parseFloat(order.totalAmount).toFixed(0)}</p>
                          {isCancelled ? (
                             <p className="text-[10px] font-bold text-red-500 uppercase">ยกเลิกแล้ว</p>
                          ) : (
                             <p className="text-[10px] font-bold text-green-500 uppercase">สำเร็จ</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <style jsx global>{`
        * { font-family: 'Playpen Sans', cursive !important; }
      `}</style>
    </div>
  );
}