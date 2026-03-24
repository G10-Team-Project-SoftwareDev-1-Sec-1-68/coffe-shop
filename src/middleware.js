import { NextResponse } from "next/server";

/**
 * Role-to-home-path mapping.
 * เปลี่ยนตรงนี้ที่เดียวถ้าต้องการเพิ่ม role ใหม่
 */
const ROLE_HOME = {
  CUSTOMER: "/order",
  STAFF: "/pos",
  ADMIN: "/dashboard",
};

/**
 * กำหนดว่า path ไหนอนุญาต role อะไรบ้าง
 * ใช้ startsWith — ดังนั้น "/order" ครอบคลุม "/order/anything" ด้วย
 */
const PATH_ROLES = {
  "/order": ["CUSTOMER"],
  "/pos": ["STAFF"],
  "/dashboard": ["ADMIN"],
  "/menu": ["CUSTOMER", "STAFF", "ADMIN"],
};

/**
 * Decode JWT payload โดยไม่ verify signature
 * (ปลอดภัย: ใช้แค่เพื่อ redirect UX — การ verify จริงอยู่ที่ API layer)
 * @param {string} token
 * @returns {{ sub: string, email: string, role: string } | null}
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // atob ใช้ได้ใน Edge runtime (Next.js middleware)
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // ---- 1. ถ้าเป็น path login/register แล้วมี token อยู่แล้ว → redirect ไป home ของ role ----
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload?.role) {
        const home = ROLE_HOME[payload.role] ?? "/";
        return NextResponse.redirect(new URL(home, request.url));
      }
    }
    return NextResponse.next();
  }

  // ---- 2. หาว่า path นี้ต้องการ role อะไร ----
  const requiredRoles = Object.entries(PATH_ROLES).find(([prefix]) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  )?.[1];

  // ไม่ใช่ protected path → ผ่าน
  if (!requiredRoles) return NextResponse.next();

  // ---- 3. ไม่มี token → redirect ไป /login ----
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ---- 4. มี token แต่ role ไม่ตรง → redirect ไป home ของ role ตัวเอง ----
  const payload = decodeJwtPayload(token);
  if (!payload?.role) {
    // token เสีย → ไป login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!requiredRoles.includes(payload.role)) {
    const home = ROLE_HOME[payload.role] ?? "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // ---- 5. ผ่านทุก check → ดำเนินการต่อ ----
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/order/:path*",
    "/pos/:path*",
    "/dashboard/:path*",
    "/menu/:path*",
  ],
};
