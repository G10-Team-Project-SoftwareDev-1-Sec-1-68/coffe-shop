"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "/menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background text-foreground">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Logo — โลโก้เดิม KAFUNG coffee bar */}
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

        {/* Right: search, cart, signup */}
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
          <Link
            href="/login"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
