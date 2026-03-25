"use client";

import Header from "@/app/components/Header";
import Toast from "@/app/components/Toast";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast, clearToast } = useToast();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: lastName || undefined,
          phone: phone || undefined,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      // After register, API sets auth-token cookie and returns user with role
      const role = data?.user?.role;
      const name = data?.user?.firstName ?? firstName;
      const redirectMap = {
        CUSTOMER: "/order",
        STAFF: "/pos",
        ADMIN: "/admin",
      };
      sessionStorage.setItem("toast", JSON.stringify({ message: `ยินดีต้อนรับสู่ KAFUNG, ${name}! ☕`, type: "success" }));
      window.location.href = redirectMap[role] ?? "/";
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const labelClass = "block text-sm font-medium text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">สมัครสมาชิก</h1>
            <p className="text-sm text-muted-foreground">
              สร้างบัญชีใหม่เพื่อสั่งเครื่องดื่มได้เร็วขึ้น
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Row: ชื่อ + นามสกุล */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="firstName" className={labelClass}>
                  ชื่อ <span className="text-destructive">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={inputClass}
                  placeholder="เช่น กาฟัง"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className={labelClass}>
                  นามสกุล
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={inputClass}
                  placeholder="ไม่บังคับ"
                />
              </div>
            </div>

            {/* เบอร์โทร */}
            <div className="space-y-2">
              <label htmlFor="phone" className={labelClass}>
                เบอร์โทรศัพท์
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={inputClass}
                placeholder="เช่น 0812345678 (ไม่บังคับ)"
              />
            </div>

            {/* อีเมล */}
            <div className="space-y-2">
              <label htmlFor="email" className={labelClass}>
                อีเมล <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* รหัสผ่าน */}
            <div className="space-y-2">
              <label htmlFor="password" className={labelClass}>
                รหัสผ่าน <span className="text-destructive">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={inputClass}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                minLength={8}
                required
              />
            </div>

            {/* ยืนยันรหัสผ่าน */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className={labelClass}>
                ยืนยันรหัสผ่าน <span className="text-destructive">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={inputClass}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            มีบัญชีแล้ว?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
