import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  try {
    const authToken = request.cookies.get("auth-token")?.value ?? null;

    if (authToken) {
      await prisma.user.updateMany({
        where: { authToken },
        data: { authToken: null },
      });
    }

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

