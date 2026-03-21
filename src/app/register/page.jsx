"use client";

import Header from "@/app/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") ?? "");
      const email = String(form.get("email") ?? "");
      const password = String(form.get("password") ?? "");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email, password }),
      });

      if (!res.ok) {
        setError("สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">สมัครสมาชิก</h1>
            <p className="text-sm text-muted-foreground">
              สร้างบัญชีใหม่เพื่อสั่งเครื่องดื่มได้เร็วขึ้น
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                ชื่อ (ไม่บังคับ)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="เช่น Kafung"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
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
                รหัสผ่าน (อย่างน้อย 8 ตัว)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>

          {error ? (
            <p className="text-center text-sm text-destructive">{error}</p>
          ) : null}

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

