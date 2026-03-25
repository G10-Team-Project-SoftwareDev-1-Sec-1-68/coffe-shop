"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StockAlertModal() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await fetch("/api/ingredients?lowStock=true");
        if (!res.ok) return;
        const data = await res.json();
        const items = data.ingredients ?? [];
        if (items.length > 0) {
          setLowStockItems(items);
          setIsOpen(true);
        }
      } catch (e) {
        // silently ignore network errors for the alert
      } finally {
        setLoading(false);
      }
    }
    fetchLowStock();
  }, []);

  if (loading || !isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
    >
      {/* Modal box */}
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: "#fff" }}
      >
        {/* Red header strip */}
        <div
          className="px-8 py-6 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
          }}
        >
          {/* Pulsing icon */}
          <div className="relative flex-shrink-0">
            <span className="text-5xl animate-bounce">🚨</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              แจ้งเตือน: สต๊อกวัตถุดิบใกล้หมด!
            </h2>
            <p className="text-red-100 text-sm mt-1 font-medium">
              พบ{" "}
              <span className="font-bold text-white bg-red-700 px-2 py-0.5 rounded-full">
                {lowStockItems.length} รายการ
              </span>{" "}
              ที่ปริมาณต่ำกว่าหรือเท่ากับจุดต่ำสุดที่กำหนด
            </p>
          </div>
        </div>

        {/* Ingredient list */}
        <div className="px-8 py-4 max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-left">
                <th className="pb-2 font-semibold">วัตถุดิบ</th>
                <th className="pb-2 font-semibold text-center">ปริมาณคงเหลือ</th>
                <th className="pb-2 font-semibold text-center">ขั้นต่ำ</th>
                <th className="pb-2 font-semibold text-center">หน่วย</th>
                <th className="pb-2 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => {
                const isEmpty = item.stockQty <= 0;
                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 font-bold text-[#3D2A1E]">
                      {item.name}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`font-extrabold text-base ${
                          isEmpty ? "text-red-600" : "text-orange-500"
                        }`}
                      >
                        {item.stockQty}
                      </span>
                    </td>
                    <td className="py-3 text-center text-gray-500">
                      {item.minQty}
                    </td>
                    <td className="py-3 text-center text-gray-500">
                      {item.unit}
                    </td>
                    <td className="py-3 text-center">
                      {isEmpty ? (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                          หมดแล้ว
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                          ใกล้หมด
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer buttons */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-gray-100 bg-gray-50">
          <Link
            href="/admin/stock"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 bg-[#3D2A1E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2E2821] transition-colors text-sm"
          >
            📦 ไปจัดการสต็อก
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
          >
            ✓ รับทราบแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
