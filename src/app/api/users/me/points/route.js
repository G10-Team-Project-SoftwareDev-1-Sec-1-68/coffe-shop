import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/users/me/points
 * Any logged-in user: returns their current points, memberTier, and recent PointLog history.
 */
export async function GET(request) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const userId = auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        memberTier: true,
        updatedAt: true,
        pointLogs: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            amount: true,
            reason: true,
            orderId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      points: user.points,
      memberTier: user.memberTier,
      updatedAt: user.updatedAt,
      logs: user.pointLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch points" },
      { status: 500 }
    );
  }
}
