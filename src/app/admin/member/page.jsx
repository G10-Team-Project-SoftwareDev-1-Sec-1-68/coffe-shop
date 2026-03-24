// src/app/admin/member/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Toast from "@/app/components/Toast";

export default function AdminMemberPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      if (!res.ok) throw new Error("โหลดข้อมูลสมาชิกไม่สำเร็จ");
      const data = await res.json();
      setMembers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Submit Add Staff
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName") || undefined,
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      password: form.get("password"),
      role: form.get("role"),
    };

    try {
      const res = await fetch('/api/users/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "เพิ่มผู้ใช้ไม่สำเร็จ");
      
      setToast({ message: "เพิ่มผู้ใช้สำเร็จ ✅", type: "success" });
      setShowAddModal(false);
      fetchMembers();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Change Role
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: form.get("role") }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "เปลี่ยน Role ไม่สำเร็จ");
      
      setToast({ message: "เปลี่ยน Role สำเร็จ ✅", type: "success" });
      setShowRoleModal(false);
      fetchMembers();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Gold': return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">👑 Gold</span>;
      case 'Silver': return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">🥈 Silver</span>;
      case 'Bronze': return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-orange-50 text-[#8B4513] border-orange-200">🥉 Bronze</span>;
      default: return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">Member</span>;
    }
  };

  const filteredMembers = members.filter(m => 
    (m.firstName + " " + m.lastName).toLowerCase().includes(search.toLowerCase()) || 
    (m.phone || "").includes(search)
  );

  return (
    <div className="space-y-6">
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">เพิ่มผู้ใช้งาน (STAFF/ADMIN)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ <span className="text-red-500">*</span></label>
                  <input name="firstName" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                  <input name="lastName" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล <span className="text-red-500">*</span></label>
                <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                <input name="phone" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน (อย่างน้อย 8 ตัว) <span className="text-red-500">*</span></label>
                <input name="password" type="password" minLength={8} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สิทธิ์การใช้งาน (Role)</label>
                <select name="role" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white">
                  <option value="STAFF">STAFF (พนักงานขาย)</option>
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">แก้สิทธิ์ผู้ใช้</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleRoleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">ปรับ Role ของ: <strong className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</strong></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สิทธิ์การใช้งาน (Role)</label>
                <select name="role" defaultValue={selectedUser.role} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white">
                  <option value="CUSTOMER">CUSTOMER (ลูกค้า)</option>
                  <option value="STAFF">STAFF (พนักงานขาย)</option>
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowRoleModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "กำลังเปลี่ยน..." : "ยืนยัน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">จัดการสมาชิก (Members / Staff)</h2>
          <p className="text-gray-500 mt-1">รายชื่อผู้ใช้งานและระบบสะสมแต้ม</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ค้นหาเบอร์โทร / ชื่อ..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B8446] focus:ring-1 focus:ring-[#9B8446] text-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#3D2A1E] text-white hover:bg-[#2E2821] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            + เพิ่มใช้งาน
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-semibold">อีเมล</th>
                <th className="px-6 py-4 font-semibold">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4 font-semibold text-center">ระดับ (Tier)</th>
                <th className="px-6 py-4 font-semibold text-right">แต้มสะสม</th>
                <th className="px-6 py-4 font-semibold text-center">ประเภท</th>
                <th className="px-6 py-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">ไม่พบข้อมูล</td></tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#3D2A1E]">{member.firstName} {member.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.phone || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    {member.role === "CUSTOMER" ? getTierBadge(member.memberTier) : <span className="text-xs text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#9B8446]">
                    {member.points?.toLocaleString() || 0} <span className="text-xs font-normal text-gray-400">pts</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${member.role === 'ADMIN' ? 'bg-red-100 text-red-700' : member.role === 'STAFF' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setSelectedUser(member); setShowRoleModal(true); }}
                      className="text-[#9B8446] hover:bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-amber-200"
                    >
                      แก้ Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {filteredMembers.length} รายการ</span>
        </div>
      </div>
    </div>
  );
}