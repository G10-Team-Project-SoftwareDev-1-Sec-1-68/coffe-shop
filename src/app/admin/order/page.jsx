// src/app/admin/order/page.jsx
"use client";

import { useState } from 'react';

export default function AdminOrderPage() {
  // 💡 ข้อมูลจำลอง (Mock Data) - รอเปลี่ยนเป็นดึงจาก API
  const [orders, setOrders] = useState([
    
  ]);

  // ฟังก์ชันแปลงสถานะเป็นป้ายสีสวยๆ
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-green-50 text-green-600 border-green-200">✅ เสิร์ฟแล้ว</span>;
      case 'PENDING':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-orange-50 text-orange-600 border-orange-200">⏳ กำลังทำ</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-red-50 text-red-600 border-red-200">❌ ยกเลิก</span>;
      default:
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">ไม่ทราบสถานะ</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ส่วนหัวของหน้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">ประวัติคำสั่งซื้อ (Orders)</h2>
          <p className="text-gray-500 mt-1">รายการออเดอร์ทั้งหมดของวันที่ {new Date().toLocaleDateString('th-TH')}</p>
        </div>
        
        {/* ปุ่มกรองข้อมูล (Filter) */}
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 hover:border-[#9B8446] hover:text-[#9B8446] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
            📅 เลือกวันที่
          </button>
          <button className="bg-[#3D2A1E] text-white hover:bg-[#2E2821] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
            รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {/* ตารางข้อมูลออเดอร์ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">รหัสออเดอร์</th>
                <th className="px-6 py-4 font-semibold">เวลา</th>
                <th className="px-6 py-4 font-semibold">ชื่อลูกค้า</th>
                <th className="px-6 py-4 font-semibold">รายการสินค้า</th>
                <th className="px-6 py-4 font-semibold text-right">ยอดรวม</th>
                <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                <th className="px-6 py-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#9B8446]">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.time} น.</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${order.customer.includes('Member') ? 'text-[#3D2A1E]' : 'text-gray-500'}`}>
                      {order.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[250px]">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#3D2A1E]">
                    ฿{order.total}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#9B8446] hover:bg-[#FDEEEE] px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer ของตาราง */}
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {orders.length} ออเดอร์</span>
          <span className="flex items-center gap-2 font-medium">
            ยอดขายรวมหน้านี้: <span className="text-[#3D2A1E] font-bold">฿{orders.reduce((sum, order) => sum + (order.status !== 'CANCELLED' ? order.total : 0), 0)}</span>
          </span>
        </div>
      </div>

    </div>
  );
}