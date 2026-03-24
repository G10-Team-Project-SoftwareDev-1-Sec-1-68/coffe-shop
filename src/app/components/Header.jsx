"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, LogOut, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "/menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
];

export default function Header() {
  const [user, setUser] = useState(null); // null = ยังโหลด, false = ไม่ได้ login

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? false))
      .catch(() => setUser(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  }

  const displayName = user
    ? user.firstName + (user.lastName ? ` ${user.lastName}` : "")
    : null;

  return (
    <header className="w-full border-b border-border bg-background text-foreground">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee-gold text-primary"
            aria-hidden
          >
            <span className="text-xl">☕</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-wide text-foreground">
              KAFUNG
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              coffee bar
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="หลัก">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-foreground transition hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 text-foreground transition hover:bg-muted"
            aria-label="ค้นหา"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/order"
            className="rounded-full p-2 text-foreground transition hover:bg-muted"
            aria-label="ตะกร้า"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* Auth section */}
          {user === null ? (
            // Loading skeleton
            <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
          ) : user ? (
            // Logged-in: แสดงชื่อ + logout
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="ออกจากระบบ"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            // Not logged in: แสดงปุ่ม login + register
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
