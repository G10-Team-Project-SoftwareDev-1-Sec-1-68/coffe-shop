import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
  try {
    const authToken = request.cookies.get("auth-token")?.value ?? null;
    if (!authToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { authToken },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ user: user ?? null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to load session" },
      { status: 500 }
    );
  }
}

