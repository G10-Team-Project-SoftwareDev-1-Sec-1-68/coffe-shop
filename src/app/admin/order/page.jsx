// src/app/admin/order/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error("โหลดข้อมูลออเดอร์ไม่สำเร็จ");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ฟังก์ชันแปลงสถานะเป็นป้ายสีสวยๆ
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-green-50 text-green-600 border-green-200">✅ เสิร์ฟแล้ว (Completed)</span>;
      case 'PENDING':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-orange-50 text-orange-600 border-orange-200">⏳ คิวใหม่ (Pending)</span>;
      case 'PREPARING':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-blue-50 text-blue-600 border-blue-200">☕ กำลังทำ (Preparing)</span>;
      case 'READY':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-yellow-50 text-yellow-600 border-yellow-200">🛎️ รอรับ (Ready)</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-red-50 text-red-600 border-red-200">❌ ยกเลิก (Cancelled)</span>;
      default:
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ส่วนหัวของหน้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">ประวัติคำสั่งซื้อ (Orders)</h2>
          <p className="text-gray-500 mt-1">รายการออเดอร์ทั้งหมดในระบบ</p>
        </div>
        
        {/* ปุ่มกรองข้อมูล (Filter) */}
        <div className="flex gap-2">
          <button 
            onClick={fetchOrders}
            className="bg-[#3D2A1E] text-white hover:bg-[#2E2821] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* ตารางข้อมูลออเดอร์ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">รหัสออเดอร์</th>
                <th className="px-6 py-4 font-semibold">ประเภท</th>
                <th className="px-6 py-4 font-semibold">เวลา</th>
                <th className="px-6 py-4 font-semibold">รายการสินค้า</th>
                <th className="px-6 py-4 font-semibold text-right">ยอดรวม</th>
                <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">ไม่มีออเดอร์</td>
                </tr>
              ) : orders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#9B8446]">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{order.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("th-TH")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[250px]">
                      {itemCount} ชิ้น
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#3D2A1E]">
                      ฿{parseFloat(order.totalAmount).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer ของตาราง */}
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {orders.length} ออเดอร์</span>
          <span className="flex items-center gap-2 font-medium">
            ยอดขายรวม: <span className="text-[#3D2A1E] font-bold">
              ฿{orders.reduce((sum, order) => sum + (order.status !== 'CANCELLED' ? parseFloat(order.totalAmount) : 0), 0).toLocaleString()}
            </span>
          </span>
        </div>
      </div>

    </div>
  );
}