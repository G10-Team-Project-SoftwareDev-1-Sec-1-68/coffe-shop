import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const payload = verifyJwtFromRequest(request);
    if (!payload?.sub) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        points: true,
        memberTier: true,
        preferredLang: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: user ?? null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to load session" },
      { status: 500 }
    );
  }
}
