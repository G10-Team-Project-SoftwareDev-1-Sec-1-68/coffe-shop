import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

const userSafeSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
};

function serializeInventoryTx(tx) {
  return {
    ...tx,
    quantity: tx.quantity != null ? Number(tx.quantity) : null,
    ingredient: tx.ingredient
      ? {
          ...tx.ingredient,
          stockQty:
            tx.ingredient.stockQty != null
              ? String(tx.ingredient.stockQty)
              : null,
          minQty:
            tx.ingredient.minQty != null
              ? String(tx.ingredient.minQty)
              : null,
          reorderQty:
            tx.ingredient.reorderQty != null
              ? String(tx.ingredient.reorderQty)
              : null,
        }
      : null,
  };
}

/**
 * GET /api/audit-logs
 * STAFF/ADMIN: last 50 audit log rows + last 50 inventory transactions (with ingredient).
 */
export async function GET(req) {
  const auth = requireStaffOrAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const [auditLogs, inventoryTransactions] = await Promise.all([
      prisma.auditLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: userSafeSelect },
        },
      }),
      prisma.inventoryTransaction.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          ingredient: true,
        },
      }),
    ]);

    return NextResponse.json({
      auditLogs,
      inventoryTransactions: inventoryTransactions.map(serializeInventoryTx),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch audit data" },
      { status: 500 }
    );
  }
}
