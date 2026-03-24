"use client";

import { useEffect, useState } from "react";
import { Coffee, QrCode, Receipt, XCircle, Clock, FileText } from "lucide-react";
import Toast from "@/app/components/Toast";
import Header from "@/app/components/Header";

// ============================================================
// Sub-components
// ============================================================

function OrderTicket({ order, active, onClick }) {
  const time = new Date(order.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => onClick(order)}
      className={`relative p-5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col gap-3 shadow-sm ${
        active
          ? "bg-amber-700 text-white border-amber-800 shadow-md transform scale-[1.02]"
          : "bg-white text-gray-800 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
      }`}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <h3 className={`font-bold text-lg leading-none ${active ? "text-white" : "text-gray-900"}`}>
            {order.orderNumber}
          </h3>
          <p className={`text-xs mt-1 flex items-center gap-1 ${active ? "text-amber-200" : "text-gray-500"}`}>
            <Clock className="w-3 h-3" /> {time}
          </p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${active ? "bg-amber-800 text-amber-100" : "bg-amber-100 text-amber-800"}`}>
          {order.type}
        </span>
      </div>

      <div className={`mt-auto pt-3 border-t flex justify-between items-center w-full ${active ? "border-amber-600/50" : "border-gray-100"}`}>
        <span className={`text-sm ${active ? "text-amber-100" : "text-gray-500"}`}>
          {itemCount} รายการ
        </span>
        <span className="font-bold text-lg">
          ฿{parseFloat(order.totalAmount).toFixed(0)}
        </span>
      </div>
    </button>
  );
}

// ============================================================
// Main POS Page (Order Ticket System)
// ============================================================

export default function POSOrderSystem() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  
  // QR Payment Modal State
  const [showQR, setShowQR] = useState(false);

  // Fetch PENDING orders
  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // ดึงออเดอร์เฉพาะที่ PENDING (รับเข้าใหม่)
      const res = await fetch("/api/orders?status=PENDING", { credentials: "include" });
      if (!res.ok) throw new Error("โหลดข้อมูลทิคเก็ตไม่สำเร็จ");
      const data = await res.json();
      setOrders(data.orders || []);
      
      // Update selected order reference if it exists
      if (selectedOrder) {
        const stillExists = (data.orders || []).find(o => o.id === selectedOrder.id);
        if (!stillExists) setSelectedOrder(null);
        else setSelectedOrder(stillExists);
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();
    // Auto-refresh every 10 seconds to get new tickets
    const interval = setInterval(() => fetchOrders(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckoutClick = () => {
    if (!selectedOrder) return;
    setShowQR(true);
  };

  const handleConfirmPayment = () => {
    // อนาคตที่นี่จะเรียก API PATCH /api/orders/:id/status เป็น COMPLETED/PREPARING
    setShowQR(false);
    setToast({ message: `รับชำระเงินออเดอร์ ${selectedOrder.orderNumber} สำเร็จ ✅`, type: "success" });
    
    // จำลองลบออกจากคิวหน้าจอ
    setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setSelectedOrder(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col font-sans overflow-hidden">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      )}

      {/* QR Modal (Dummy) */}
      {showQR && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-700 p-4 text-center text-white relative">
              <h2 className="text-xl font-bold">สแกนเพื่อชำระเงิน</h2>
              <p className="opacity-90 text-sm mt-1">{selectedOrder.orderNumber}</p>
              <button 
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              {/* Dummy QR Code Image / Icon */}
              <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-4 border-amber-700/20 mb-6 relative">
                 <QrCode className="w-24 h-24 text-gray-800" />
                 {/* Decorative scanner line */}
                 <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-amber-500 shadow-[0_0_10px_2px_rgba(245,158,11,0.5)] animate-pulse" />
              </div>
              
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-1">ยอดชำระสุทธิ</p>
                <p className="text-3xl font-bold text-gray-900">฿{parseFloat(selectedOrder.totalAmount).toFixed(0)}</p>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-95 transition-all"
              >
                ยืนยันการรับเงิน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center shadow-inner">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Order Tickets</h1>
            <p className="text-xs text-amber-700 font-medium">KAFUNG POS SYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            เชื่อมต่อระบบรับออเดอร์
          </div>
          <p className="text-sm text-gray-500 font-medium hidden sm:block">
            {new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "short" })}
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* ================= LEFT: TICKETS QUEUE ================= */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-amber-700" />
              คิวออเดอร์ใหม่ 
              <span className="bg-amber-100 text-amber-800 text-base px-2 py-0.5 rounded-full ml-2">
                {orders.length}
              </span>
            </h2>
            <button 
              onClick={() => fetchOrders()}
              className="text-sm text-gray-500 hover:text-amber-700 transition-colors"
            >
              รีเฟรชข้อมูล
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button 
                onClick={() => fetchOrders()}
                className="px-6 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100"
              >
                ลองใหม่
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-700">ไม่มีออเดอร์ใหม่</p>
                <p className="text-sm text-gray-400 mt-1">ออเดอร์จากลูกค้าจะแสดงที่นี่โดยอัตโนมัติ</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
              {orders.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  active={selectedOrder?.id === order.id}
                  onClick={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: TICKET DETAILS ================= */}
        <div className="w-[400px] xl:w-[450px] bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-2xl z-20">
          {!selectedOrder ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-8">
              <Receipt className="w-16 h-16 text-gray-200" />
              <p className="text-lg font-medium text-gray-400">เลือกตั๋วออเดอร์ด้านซ้าย<br/>เพื่อดูรายละเอียด</p>
            </div>
          ) : (
            <>
              {/* Ticket Header */}
              <div className="p-6 border-b border-gray-100 bg-amber-50/50">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black text-gray-900">{selectedOrder.orderNumber}</h2>
                  <span className="bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {selectedOrder.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedOrder.createdAt).toLocaleTimeString("th-TH")}
                  </span>
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">
                    {selectedOrder.pickupMethod === "DELIVERY" ? "จัดส่ง" : "รับที่ร้าน"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">รายการสินค้า</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => {
                    const variantName = item.variant?.name ? `(${item.variant.name})` : "";
                    const productName = item.variant?.product?.name || "Unknown Product";
                    // item.options might be an object stringified or plain JSON
                    let opts = item.options ? (typeof item.options === "string" ? JSON.parse(item.options) : item.options) : null;
                    
                    return (
                      <div key={item.id || idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0">
                          {item.quantity}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-bold text-gray-800">{productName} <span className="text-gray-500 font-normal">{variantName}</span></p>
                            <p className="font-bold text-gray-900">฿{(parseFloat(item.priceAtTime) * item.quantity).toFixed(0)}</p>
                          </div>
                          
                          {/* Options Breakdown */}
                          {opts && (
                            <ul className="mt-1 space-y-1">
                              {opts.sweetness !== undefined && (
                                <li className="text-xs text-gray-500">• ความหวาน {opts.sweetness}%</li>
                              )}
                              {opts.extraShot > 1 && (
                                <li className="text-xs text-amber-600 font-medium">• {opts.extraShot} ช็อต</li>
                              )}
                              {opts.topping && opts.topping !== "none" && (
                                <li className="text-xs text-gray-500">• ท็อปปิ้ง: {opts.topping}</li>
                              )}
                              {opts.customNote && (
                                <li className="text-xs text-red-500 italic">"{opts.customNote}"</li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {selectedOrder.deliveryAddress && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ที่อยู่จัดส่ง</h3>
                    <p className="text-sm text-gray-700">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}
              </div>

              {/* Checkout Footer */}
              <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-500 font-medium">รวมสุทธิ</span>
                  <span className="text-4xl font-black text-amber-700">
                    ฿{parseFloat(selectedOrder.totalAmount).toFixed(0)}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-900/20 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <QrCode className="w-6 h-6" />
                  ชำระเงิน (สแกน QR)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}