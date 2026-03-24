// src/app/admin/stock/page.jsx
"use client";

import { useState } from 'react';

export default function AdminStockPage() {
  // 💡 ข้อมูลจำลอง (Mock Data) - รอเปลี่ยนเป็นดึงจาก API
  const [stockItems, setStockItems] = useState([
    
  ]);

  // ฟังก์ชันคำนวณสถานะสินค้า
  const getStatus = (remaining, reorderPoint) => {
    if (remaining <= reorderPoint * 0.5) {
      return { label: 'ใกล้หมด', color: 'bg-red-50 text-red-600 border-red-200' };
    }
    if (remaining <= reorderPoint) {
      return { label: 'น้อย', color: 'bg-orange-50 text-orange-600 border-orange-200' };
    }
    return { label: 'ปกติ', color: 'bg-green-50 text-green-600 border-green-200' };
  };

  return (
    <div className="space-y-6">
      
      {/* ส่วนหัวของหน้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">สถานะคลังสินค้า (Stock)</h2>
          <p className="text-gray-500 mt-1">จัดการวัตถุดิบและแพ็กเกจจิ้งของร้าน</p>
        </div>
        
        {/* ปุ่มเพิ่มสินค้าใหม่ */}
        <button className="bg-[#5F7840] hover:brightness-110 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
          <span>+</span> เพิ่มวัตถุดิบใหม่
        </button>
      </div>

      {/* ตารางข้อมูลคลังสินค้า */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">รหัส</th>
                <th className="px-6 py-4 font-semibold">ชื่อวัตถุดิบ</th>
                <th className="px-6 py-4 font-semibold">หมวดหมู่</th>
                <th className="px-6 py-4 font-semibold text-right">คงเหลือ</th>
                <th className="px-6 py-4 font-semibold text-right">จุดสั่งซื้อ</th>
                <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                <th className="px-6 py-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockItems.map((item) => {
                const status = getStatus(item.remaining, item.reorderPoint);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.id}</td>
                    <td className="px-6 py-4 font-bold text-[#3D2A1E]">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{item.category}</span>
                    </td>
                    
                    {/* ทำตัวเลขสีแดงถ้าของเหลือน้อย */}
                    <td className={`px-6 py-4 text-right font-bold ${item.remaining <= item.reorderPoint ? 'text-red-500' : 'text-[#3D2A1E]'}`}>
                      {item.remaining} <span className="text-xs font-normal text-gray-400 ml-1">{item.unit}</span>
                    </td>
                    
                    <td className="px-6 py-4 text-right text-gray-400 text-sm">
                      {item.reorderPoint} {item.unit}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#9B8446] hover:bg-[#FDEEEE] px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer ของตารางบอกจำนวนรายการ */}
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {stockItems.length} รายการ</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> มีของที่ต้องสั่งด่วน
          </span>
        </div>
      </div>

    </div>
  );
}