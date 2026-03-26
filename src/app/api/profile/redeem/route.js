import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtFromRequest } from "@/lib/auth";

export async function POST(request) {
  try {
    const payload = verifyJwtFromRequest(request);
    if (!payload?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rewardId, pointsNeeded, rewardTitle } = await request.json();

    if (!rewardId || !pointsNeeded) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // 1. Fetch current user points
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.points < pointsNeeded) {
      return NextResponse.json({ error: "คะแนนไม่เพียงพอ" }, { status: 400 });
    }

    // 2. Perform Transaction: Deduct points and create log
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Deduct points
      const updated = await tx.user.update({
        where: { id: payload.sub },
        data: {
          points: {
            decrement: pointsNeeded
          }
        }
      });

      // Create log
      await tx.pointLog.create({
        data: {
          userId: payload.sub,
          amount: -pointsNeeded,
          reason: `แลกรางวัล: ${rewardTitle || rewardId}`,
        }
      });

      return updated;
    });

    return NextResponse.json({ 
      success: true, 
      points: updatedUser.points,
      message: `แลก ${rewardTitle} สำเร็จ`
    });

  } catch (error) {
    console.error("Redeem error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to redeem points" },
      { status: 500 }
    );
  }
}
