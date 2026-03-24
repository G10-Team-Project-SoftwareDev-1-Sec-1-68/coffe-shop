// src/app/admin/member/page.jsx
"use client";

import { useState } from 'react';

export default function AdminMemberPage() {
  // 💡 ข้อมูลจำลอง (Mock Data) - รอเปลี่ยนเป็นดึงจาก API: fetch('/api/members')
  const [members, setMembers] = useState([
    
  ]);

  // ฟังก์ชันแปลงระดับสมาชิกเป็นป้ายสี
  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Gold':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">👑 Gold</span>;
      case 'Silver':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">🥈 Silver</span>;
      case 'Bronze':
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-orange-50 text-[#8B4513] border-orange-200">🥉 Bronze</span>;
      default:
        return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">Member</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ส่วนหัวของหน้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">จัดการสมาชิก (Members)</h2>
          <p className="text-gray-500 mt-1">รายชื่อลูกค้าและระบบสะสมแต้มของ KAFUNG</p>
        </div>
        
        {/* กลุ่มปุ่มจัดการ */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* ช่องค้นหา */}
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="🔍 ค้นหาเบอร์โทร / ชื่อ..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B8446] focus:ring-1 focus:ring-[#9B8446] text-sm"
            />
          </div>
          <button className="bg-[#3D2A1E] text-white hover:bg-[#2E2821] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap">
            + เพิ่มสมาชิก
          </button>
        </div>
      </div>

      {/* ตารางข้อมูลสมาชิก */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">รหัสสมาชิก</th>
                <th className="px-6 py-4 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-semibold">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4 font-semibold text-center">ระดับ (Tier)</th>
                <th className="px-6 py-4 font-semibold text-right">แต้มสะสม</th>
                <th className="px-6 py-4 font-semibold text-center">วันที่สมัคร</th>
                <th className="px-6 py-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{member.id}</td>
                  <td className="px-6 py-4 font-bold text-[#3D2A1E]">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.phone}</td>
                  <td className="px-6 py-4 text-center">
                    {getTierBadge(member.tier)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#9B8446]">
                    {member.points.toLocaleString()} <span className="text-xs font-normal text-gray-400">pts</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {member.joinDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#3D2A1E] hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-gray-200">
                      ดูประวัติ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer ของตาราง */}
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {members.length} รายการ</span>
        </div>
      </div>

    </div>
  );
}