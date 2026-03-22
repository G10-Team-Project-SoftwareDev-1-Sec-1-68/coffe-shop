import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set("auth-token", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to logout" },
      { status: 500 }
    );
  }
}
