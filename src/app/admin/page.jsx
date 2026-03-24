// src/app/admin/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [kpiData, setKpiData] = useState({
    totalSales: "0",
    totalOrders: 0,
    lowStockItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/dashboard/summary');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('ติดสิทธิ์การเข้าถึง (401 Unauthorized) ต้องทำระบบ Login ก่อน');
          }
          throw new Error('ไม่สามารถดึงข้อมูลจาก API ได้');
        }

        const data = await response.json();
        setKpiData({
          totalSales: data.totalSales,
          totalOrders: data.totalOrders,
          lowStockItems: data.lowStockItems,
        });
      } catch (err) {
        setError(err.message);
        setKpiData({
          totalSales: "15400", // ใส่ข้อมูลจำลองให้ดูสวยๆ เวลามี Error
          totalOrders: 82,
          lowStockItems: 4,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">กำลังโหลดข้อมูล... ⏳</div>;
  }

  // ข้อมูลจำลองสำหรับวาดกราฟ
  const mockChartData = [
    { day: 'จ.', value: 0, label: '0' },
    { day: 'อ.', value: 0, label: '0' },
    { day: 'พ.', value: 0, label: '0' },
    { day: 'พฤ.', value: 0, label: '0' },
    { day: 'ศ.', value: 0, label: '0' },
    { day: 'ส.', value: 0, label: '0' },
    { day: 'อา.', value: 0, label: '0' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3D2A1E]">ภาพรวมร้าน (Dashboard)</h2>
        <p className="text-gray-500 text-sm md:text-base">ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <span>⚠️</span> 
          <span><strong>แจ้งเตือน:</strong> {error} (กำลังแสดงข้อมูลจำลอง)</span>
        </div>
      )}

      {/* ---------------- 1. ส่วนการ์ด KPI ด้านบน ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 font-medium mb-2">ยอดขายวันนี้</div>
          <div className="text-4xl font-bold text-[#3D2A1E]">
            ฿{Number(kpiData.totalSales).toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 font-medium mb-2">ออเดอร์วันนี้</div>
          <div className="text-4xl font-bold text-[#3D2A1E]">
            {kpiData.totalOrders} <span className="text-lg font-normal text-gray-400">รายการ</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>
          <div className="text-gray-500 font-medium mb-2">สินค้าใกล้หมดสต็อก</div>
          <div className="text-4xl font-bold text-orange-500">
            {kpiData.lowStockItems} <span className="text-lg font-normal">รายการ</span>
          </div>
          <Link href="/admin/stock" className="mt-4 text-sm text-orange-500 font-medium text-left hover:underline">
            ไปจัดการคลังสินค้า →
          </Link>
        </div>
      </div>

      {/* ---------------- 2. ส่วนกราฟยอดขาย  ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#3D2A1E]">ยอดขายย้อนหลัง 7 วัน</h3>
            <p className="text-sm text-gray-500 mt-1">เปรียบเทียบยอดขายในแต่ละวัน</p>
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#9B8446] bg-gray-50 cursor-pointer">
            <option>สัปดาห์นี้</option>
            <option>สัปดาห์ที่แล้ว</option>
          </select>
        </div>

        {/* ตัวกราฟแท่ง (Bar Chart) */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-4 border-b border-gray-100 pb-2 px-2">
          {mockChartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
              {/* ตัวเลขที่จะโผล่มาตอนเอาเมาส์ชี้ (Hover) */}
              <span className="text-xs font-bold text-[#9B8446] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
              
              {/* แท่งกราฟ */}
              <div 
                className="w-full max-w-[40px] bg-[#FDEEEE] group-hover:bg-[#9B8446] rounded-t-lg transition-all duration-500 relative cursor-pointer"
                style={{ height: `${item.value}%` }}
              ></div>
              
              {/* ป้ายชื่อวันด้านล่าง */}
              <span className="text-sm font-medium text-gray-500 mt-3">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}