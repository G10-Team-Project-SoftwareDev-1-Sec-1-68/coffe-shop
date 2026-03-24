"use client";

import Header from "@/app/components/Header";
import Toast from "@/app/components/Toast";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") ?? "");
      const password = String(form.get("password") ?? "");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      const role = data?.user?.role;
      const name = data?.user?.firstName ?? "คุณ";
      const redirectMap = {
        CUSTOMER: "/order",
        STAFF: "/pos",
        ADMIN: "/dashboard",
      };
      // ส่ง toast message ข้ามหน้าผ่าน sessionStorage
      sessionStorage.setItem("toast", JSON.stringify({ message: `ยินดีต้อนรับกลับมา, ${name}! 👋`, type: "success" }));
      window.location.href = redirectMap[role] ?? "/";
    } catch {
      setError("เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              เข้าสู่ระบบ
            </h1>
            <p className="text-sm text-muted-foreground">
              ยินดีต้อนรับกลับมา เลือกวิธีการเข้าสู่ระบบของคุณ
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                อีเมล

              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {error ? (
            <p className="text-center text-sm text-destructive">{error}</p>
          ) : null}

          <p className="text-center text-xs text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}