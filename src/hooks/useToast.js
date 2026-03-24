"use client";

import { useEffect, useState } from "react";

/**
 * Hook สำหรับรับ toast message ที่ถูกส่งข้ามหน้าผ่าน sessionStorage
 * ส่งมาจาก login/register page ก่อน redirect
 *
 * Usage:
 *   const { toast, clearToast } = useToast();
 *   <Toast message={toast.message} type={toast.type} onClose={clearToast} />
 */
export function useToast() {
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    const raw = sessionStorage.getItem("toast");
    if (raw) {
      try {
        setToast(JSON.parse(raw));
      } catch {
        setToast({ message: raw, type: "success" });
      }
      sessionStorage.removeItem("toast");
    }
  }, []);

  const clearToast = () => setToast({ message: "", type: "success" });

  return { toast, clearToast };
}
