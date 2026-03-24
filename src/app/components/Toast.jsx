"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const BG = {
  success: "border-green-500/30 bg-green-50 dark:bg-green-950/40",
  error: "border-red-500/30 bg-red-50 dark:bg-red-950/40",
  info: "border-blue-500/30 bg-blue-50 dark:bg-blue-950/40",
};

/**
 * Toast notification component.
 *
 * Usage:
 *   <Toast message="เข้าสู่ระบบสำเร็จ!" type="success" />
 *
 * Props:
 *   message  {string}                    — ข้อความที่แสดง
 *   type     {"success"|"error"|"info"}  — ประเภท (default: "success")
 *   duration {number}                    — ms ที่แสดงก่อนหายไป (default: 4000)
 *   onClose  {() => void}               — callback เมื่อปิด
 */
export default function Toast({ message, type = "success", duration = 4000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-5 right-5 z-[100] flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out max-w-sm w-full
        ${BG[type]}
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[type]}</span>
      <p className="flex-1 text-sm font-medium text-foreground leading-snug">{message}</p>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition hover:text-foreground"
        aria-label="ปิด"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
