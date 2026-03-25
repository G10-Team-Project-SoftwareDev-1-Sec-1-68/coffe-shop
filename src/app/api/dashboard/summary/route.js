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

function getPast7DaysRange() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    dates.push({ 
      day: d.toLocaleDateString('th-TH', { weekday: 'short' }), 
      start: d, 
      end 
    });
  }
  return dates;
}

/**
 * GET /api/dashboard/summary
 * STAFF/ADMIN: today's sales, order count, low-stock ingredient count, daily sales chart, top products
 */
export async function GET(request) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { start, end } = getTodayRange();
    const past7Days = getPast7DaysRange();
    const weekStart = past7Days[0].start;
    const weekEnd = past7Days[6].end;

    // 1. Fetch Today's Aggregates
    const [salesAgg, totalOrders, lowStockRows, todayItems, weekSales] = await Promise.all([
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
      // 2. Fetch Today's Order Items for Top Products
      prisma.orderItem.findMany({
        where: {
          order: {
            status: "COMPLETED",
            updatedAt: { gte: start, lte: end },
          },
        },
        include: {
          variant: {
            include: { product: true },
          },
        },
      }),
      // 3. Fetch past 7 days sales for Bar Chart
      prisma.order.findMany({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: weekStart, lte: weekEnd },
        },
        select: {
          totalAmount: true,
          updatedAt: true
        }
      })
    ]);

    const totalSales = salesAgg._sum.totalAmount != null ? String(salesAgg._sum.totalAmount) : "0";
    const lowStockItems = Array.isArray(lowStockRows) && lowStockRows[0]?.c != null ? Number(lowStockRows[0].c) : 0;

    // Build Top Products (Pie Chart Data)
    const salesByProduct = {};
    todayItems.forEach(item => {
      const productName = item.variant?.product?.name || "Unknown";
      const variantName = item.variant?.name ? ` (${item.variant.name})` : "";
      const name = `${productName}${variantName}`;
      
      if (!salesByProduct[name]) {
        salesByProduct[name] = { name, quantity: 0, revenue: 0 };
      }
      salesByProduct[name].quantity += item.quantity;
      salesByProduct[name].revenue += Math.floor(item.quantity * parseFloat(item.priceAtTime));
    });

    const topProducts = Object.values(salesByProduct).sort((a, b) => b.revenue - a.revenue);

    // Build 7 Days Sales (Bar Chart Data)
    const chartData = past7Days.map(dayObj => {
      // Find orders that were completed on this day
      const daySales = weekSales.filter(o => o.updatedAt >= dayObj.start && o.updatedAt <= dayObj.end);
      const total = daySales.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      return {
        day: dayObj.day,
        value: total, // we will calculate percentage later in frontend or just pass raw data
        label: total.toLocaleString()
      };
    });

    // We can compute Max for the bar chart scaling
    const maxValue = Math.max(...chartData.map(d => d.value), 1);
    const finalChartData = chartData.map(d => ({
      ...d,
      heightPercent: Math.floor((d.value / maxValue) * 100)
    }));

    return NextResponse.json({
      dateRange: { start: start.toISOString(), end: end.toISOString() },
      totalSales,
      totalOrders,
      lowStockItems,
      topProducts,
      chartData: finalChartData
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to load dashboard summary" },
      { status: 500 }
    );
  }
}
