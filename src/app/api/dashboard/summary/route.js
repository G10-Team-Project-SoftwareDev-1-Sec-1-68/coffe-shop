import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * GET /api/dashboard/summary
 * STAFF/ADMIN: today's sales, order count, low-stock ingredient count.
 */
export async function GET(request) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { start, end } = getTodayRange();

    const [salesAgg, totalOrders, lowStockRows] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: start, lte: end },
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS c
        FROM "Ingredient"
        WHERE "stockQty" <= "minQty"
      `,
    ]);

    const totalSales =
      salesAgg._sum.totalAmount != null
        ? String(salesAgg._sum.totalAmount)
        : "0";

    const lowStockItems =
      Array.isArray(lowStockRows) && lowStockRows[0]?.c != null
        ? Number(lowStockRows[0].c)
        : 0;

    return NextResponse.json({
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      totalSales,
      totalOrders,
      lowStockItems,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to load dashboard summary" },
      { status: 500 }
    );
  }
}
