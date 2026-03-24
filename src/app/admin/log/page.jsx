"use client";

import { useState, useEffect } from 'react';

export default function AdminLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("audit"); // 'audit' or 'inventory'
  
  // Data lists
  const [auditLogs, setAuditLogs] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs', { cache: 'no-store' });
      if (!res.ok) throw new Error("โหลดข้อมูล Logs ไม่สำเร็จ");
      const data = await res.json();
      setAuditLogs(data.auditLogs || []);
      setInventoryLogs(data.inventoryTransactions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* ส่วนหัวของหน้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">ประวัติการใช้งาน (System Logs)</h2>
          <p className="text-gray-500 mt-1">ประวัติการกระทำของผู้ใช้ และประวัติการปรับสต็อก</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
        >
          รีเฟรชข้อมูล
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setTab("audit")}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${tab === "audit" ? "border-[#9B8446] text-[#9B8446]" : "border-transparent text-gray-500 hover:text-gray-800"}`}
        >
          ประวัติผู้ใช้งาน (Audit Logs)
        </button>
        <button
          onClick={() => setTab("inventory")}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${tab === "inventory" ? "border-[#5F7840] text-[#5F7840]" : "border-transparent text-gray-500 hover:text-gray-800"}`}
        >
          ประวัติการปรับคลังสินค้า (Inventory)
        </button>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {tab === "audit" ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">เวลา</th>
                  <th className="px-6 py-4 font-semibold">ผู้ใช้งาน</th>
                  <th className="px-6 py-4 font-semibold">การกระทำ (Action)</th>
                  <th className="px-6 py-4 font-semibold">เอนทิตี (Entity)</th>
                  <th className="px-6 py-4 font-semibold">รายละเอียดย่อย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">ไม่มีประวัติการใช้งาน</td></tr>
                ) : auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString("th-TH")}</td>
                    <td className="px-6 py-4 font-bold text-[#3D2A1E]">
                      {log.user ? `${log.user.firstName} ${log.user.lastName || ""}` : "System"}
                      <div className="text-xs font-normal text-gray-400">{log.user?.role || ""}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#9B8446]">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.entity ? (
                        <span className="bg-gray-100 px-2 py-1 rounded inline-block">
                          {log.entity} <span className="text-gray-400 text-xs ml-1">{log.entityId}</span>
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono max-w-xs truncate" title={JSON.stringify(log.details)}>
                      {log.details ? JSON.stringify(log.details) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">เวลา</th>
                  <th className="px-6 py-4 font-semibold">วัตถุดิบ</th>
                  <th className="px-6 py-4 font-semibold">ประเภทรายการ</th>
                  <th className="px-6 py-4 font-semibold text-right">จำนวนหน่วย</th>
                  <th className="px-6 py-4 font-semibold">เหตุผล/หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                ) : inventoryLogs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">ไม่มีประวัติการปรับคลัง</td></tr>
                ) : inventoryLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString("th-TH")}</td>
                    <td className="px-6 py-4 font-bold text-[#3D2A1E]">
                      {log.ingredient?.name || "ไม่ทราบวัตถุดิบ"}
                      <div className="text-xs font-normal text-gray-400">หน่วย: {log.ingredient?.unit || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {log.type === "RESTOCK" && <span className="bg-green-100 text-green-700 px-2 py-1 rounded">เติมสต็อก (RESTOCK)</span>}
                      {log.type === "SALE" && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">ตัดขาย (SALE)</span>}
                      {log.type === "WASTE" && <span className="bg-red-100 text-red-700 px-2 py-1 rounded">ทิ้ง (WASTE)</span>}
                      {log.type === "ADJUSTMENT" && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">ปรับสมดุล (ADJUST)</span>}
                      {!["RESTOCK", "SALE", "WASTE", "ADJUSTMENT"].includes(log.type) && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{log.type}</span>}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${log.quantity > 0 ? "text-green-600" : log.quantity < 0 ? "text-red-600" : "text-gray-600"}`}>
                      {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.reason || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {tab === "audit" ? auditLogs.length : inventoryLogs.length} รายการล่าสุด</span>
        </div>
      </div>
    </div>
  );
}
