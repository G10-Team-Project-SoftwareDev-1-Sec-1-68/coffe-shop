// src/app/admin/stock/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Toast from "@/app/components/Toast";

export default function AdminStockPage() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [defaultAction, setDefaultAction] = useState("RESTOCK");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ingredients', { cache: 'no-store' });
      if (!res.ok) throw new Error("โหลดข้อมูลวัตถุดิบไม่สำเร็จ");
      const data = await res.json();
      setStockItems(data.ingredients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // Submit Add New Ingredient
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      stockQty: parseFloat(form.get("stockQty")) || 0,
      minQty: parseFloat(form.get("minQty")) || 0,
      unit: form.get("unit"),
    };

    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "เพิ่มวัตถุดิบไม่สำเร็จ");
      
      setToast({ message: "เพิ่มวัตถุดิบสำเร็จ ✅", type: "success" });
      setShowAddModal(false);
      fetchStock();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Stock Adjustment
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    
    let qty = parseFloat(form.get("quantity"));
    const type = form.get("type"); // RESTOCK, WASTE, ADJUSTMENT
    if (type === "ADJUSTMENT") {
      // For absolute adjustment, we calculate delta
      // Actually API accepts delta for ADJUSTMENT type but wait, if type="ADJUSTMENT" and qty positive it goes up, if negative goes down
      // Let's pass the raw qty. The backend takes care of it.
    }
    
    try {
      const res = await fetch(`/api/inventory/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: selectedItem.id,
          type: type,
          quantity: qty,
          reason: form.get("reason") || undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "ปรับสต็อกไม่สำเร็จ");
      
      setToast({ message: "ปรับสต็อกสำเร็จ ✅", type: "success" });
      setShowAdjustModal(false);
      fetchStock();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatus = (remaining, minQty) => {
    if (remaining <= minQty * 0.5) return { label: 'แจ้งเตือน (ใกล้หมด)', color: 'bg-red-50 text-red-600 border-red-200' };
    if (remaining <= minQty) return { label: 'น้อย (ต้องสั่งซื้อ)', color: 'bg-orange-50 text-orange-600 border-orange-200' };
    return { label: 'ปกติ', color: 'bg-green-50 text-green-600 border-green-200' };
  };

  const lowStockCount = stockItems.filter(item => item.stockQty <= item.minQty).length;

  return (
    <div className="space-y-6">
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">เพิ่มวัตถุดิบใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวัตถุดิบ <span className="text-red-500">*</span></label>
                <input name="name" required placeholder="เช่น เมล็ดกาแฟบราซิล" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยนับ <span className="text-red-500">*</span></label>
                  <input name="unit" required placeholder="เช่น กรัม, ml, ขวด" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สต็อกเริ่มต้น</label>
                  <input name="stockQty" type="number" step="0.01" defaultValue={0} min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จุดสั่งซื้อขั้นต่ำ (แจ้งเตือน)</label>
                  <input name="minQty" type="number" step="0.01" defaultValue={0} min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#5F7840] text-white py-3 rounded-xl font-bold hover:bg-[#4A5D32] transition-colors disabled:opacity-50">
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกวัตถุดิบ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">จัดการสต็อก</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">วัตถุดิบ</p>
                  <p className="font-bold text-gray-800">{selectedItem.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">คงเหลือเดิม</p>
                  <p className="font-bold text-[#5F7840]">{parseFloat(selectedItem.stockQty)} {selectedItem.unit}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการทำรายการ</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="border border-gray-200 rounded-lg p-2 text-sm text-center cursor-pointer hover:bg-green-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                    <input type="radio" name="type" value="RESTOCK" defaultChecked={defaultAction === "RESTOCK"} className="sr-only" />
                    <span className="font-bold text-green-700">+ เติมสต็อก</span>
                  </label>
                  <label className="border border-gray-200 rounded-lg p-2 text-sm text-center cursor-pointer hover:bg-red-50 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                    <input type="radio" name="type" value="WASTE" defaultChecked={defaultAction === "WASTE"} className="sr-only" />
                    <span className="font-bold text-red-700">- ทิ้งของเสีย</span>
                  </label>
                  <label className="col-span-2 border border-gray-200 rounded-lg p-2 text-sm text-center cursor-pointer hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <input type="radio" name="type" value="ADJUSTMENT" defaultChecked={defaultAction === "ADJUSTMENT"} className="sr-only" />
                    <span className="font-bold text-blue-700">ปรับสมดุล (ระบุ + หรือ - ได้)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนหน่วย ({selectedItem.unit}) <span className="text-red-500">*</span></label>
                <input name="quantity" type="number" step="0.01" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" placeholder="ตัวเลข เช่น 500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <input name="reason" placeholder="เช่น สั่งซื้อลอตใหม่, หกแตก, นับสต็อกจริง" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5F7840]" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAdjustModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#5F7840] text-white py-3 rounded-xl font-bold hover:bg-[#4A5D32] transition-colors disabled:opacity-50">
                  {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการทำรายการ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D2A1E]">สถานะคลังสินค้า (Stock)</h2>
          <p className="text-gray-500 mt-1">จัดการวัตถุดิบและแพ็กเกจจิ้งของร้าน</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStock} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
            รีเฟรชข้อมูล
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#5F7840] hover:brightness-110 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span>+</span> เพิ่มวัตถุดิบใหม่
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">⚠️ {error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">ชื่อวัตถุดิบ</th>
                <th className="px-6 py-4 font-semibold text-right">คงเหลือ</th>
                <th className="px-6 py-4 font-semibold text-right">จุดสั่งซื้อขั้นต่ำ (Min Qty)</th>
                <th className="px-6 py-4 font-semibold text-center">หน่วย (Unit)</th>
                <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                <th className="px-6 py-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</td></tr>
              ) : stockItems.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">ไม่มีข้อมูลวัตถุดิบ</td></tr>
              ) : stockItems.map((item) => {
                const status = getStatus(item.stockQty, item.minQty);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#3D2A1E]">{item.name}</td>
                    <td className={`px-6 py-4 text-right font-bold text-lg ${item.stockQty <= item.minQty ? 'text-red-500' : 'text-[#3D2A1E]'}`}>
                      {parseFloat(item.stockQty)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 font-medium">{parseFloat(item.minQty)}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded-md">{item.unit}</span></td>
                    <td className="px-6 py-4 text-center"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${status.color}`}>{status.label}</span></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedItem(item); setDefaultAction("RESTOCK"); setShowAdjustModal(true); }}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                          ➕ เติมของ
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(item); setDefaultAction("ADJUSTMENT"); setShowAdjustModal(true); }}
                          className="text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-gray-200"
                        >
                          ⚙️ ปรับ/ทิ้ง
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {stockItems.length} รายการ</span>
          {lowStockCount > 0 && (
            <span className="flex items-center gap-2 text-red-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> มีของที่ต้องสั่งด่วน ({lowStockCount} รายการ)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}