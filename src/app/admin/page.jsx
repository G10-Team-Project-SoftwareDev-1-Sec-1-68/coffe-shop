// src/app/admin/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StockAlertModal from '@/components/StockAlertModal';

export default function AdminDashboardPage() {
  const [kpiData, setKpiData] = useState({
    totalSales: "0",
    totalOrders: 0,
    lowStockItems: 0,
    chartData: [],
    topProducts: [],
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
          chartData: data.chartData || [],
          topProducts: data.topProducts || [],
        });
      } catch (err) {
        setError(err.message);
        setKpiData(prev => ({
          ...prev,
          totalSales: "0",
          totalOrders: 0,
          lowStockItems: 0,
        }));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">กำลังโหลดข้อมูล... ⏳</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <StockAlertModal />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Bar Chart - 7 Days */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-[#3D2A1E]">ยอดขายย้อนหลัง 7 วัน</h3>
              <p className="text-sm text-gray-500 mt-1">เปรียบเทียบยอดขายในแต่ละวัน</p>
            </div>
          </div>
          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#F5F5F5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'ยอดขาย']}
                />
                <Bar dataKey="value" fill="#9B8446" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Top Products Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-[#3D2A1E]">เมนูขายดีวันนี้</h3>
            <p className="text-sm text-gray-500 mt-1">สัดส่วนยอดขายแยกรุ่น (Hover ดูรายละเอียด)</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center mt-auto">
            {kpiData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpiData.topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="name"
                  >
                    {kpiData.topProducts.map((entry, index) => {
                      const COLORS = ['#9B8446', '#BCA871', '#D6C79A', '#E8DEBD', '#4A5D32', '#6B874B', '#8FA971', '#A3B49B'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                    })}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(value, name, props) => [`฿${Number(value).toLocaleString()} (${props.payload.quantity} แก้ว)`, name]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-2">☕️</span>
                <p className="font-medium">ยังไม่มีข้อมูลยอดขายวันนี้</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}