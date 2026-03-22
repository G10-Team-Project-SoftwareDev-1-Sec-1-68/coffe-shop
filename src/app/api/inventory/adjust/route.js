import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

const TransactionTypeEnum = z.enum(["RESTOCK", "SALE", "WASTE", "ADJUSTMENT"]);

const AdjustBodySchema = z.object({
  ingredientId: z.string().uuid(),
  type: TransactionTypeEnum,
  quantity: z.number(),
  reason: z.string().trim().max(500).optional().nullable(),
});

/**
 * Compute signed delta applied to ingredient stock.
 * RESTOCK / positive ADJUSTMENT increase stock; SALE/WASTE decrease; negative ADJUSTMENT decreases.
 */
function computeStockDelta(type, quantity) {
  if (type === "RESTOCK") return quantity;
  if (type === "SALE" || type === "WASTE") return -quantity;
  return quantity;
}

/**
 * Quantity stored on InventoryTransaction (audit trail): signed change.
 */
function transactionRecordQuantity(type, quantity) {
  return computeStockDelta(type, quantity);
}

/**
 * POST /api/inventory/adjust
 * STAFF/ADMIN: adjust stock and log InventoryTransaction.
 */
export async function POST(request) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = AdjustBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { ingredientId, type, quantity, reason } = parsed.data;

    if (type === "ADJUSTMENT") {
      if (quantity === 0) {
        return NextResponse.json(
          { error: "quantity must not be 0 for ADJUSTMENT" },
          { status: 400 }
        );
      }
    } else if (quantity <= 0) {
      return NextResponse.json(
        { error: "quantity must be positive for this transaction type" },
        { status: 400 }
      );
    }
    const delta = computeStockDelta(type, quantity);
    const txQty = transactionRecordQuantity(type, quantity);

    const result = await prisma.$transaction(async (tx) => {
      const ingredient = await tx.ingredient.findUnique({
        where: { id: ingredientId },
      });
      if (!ingredient) {
        return { error: "Ingredient not found" };
      }

      const nextStock = ingredient.stockQty + delta;
      if (nextStock < 0) {
        return { error: "Insufficient stock for this adjustment" };
      }

      const updated = await tx.ingredient.update({
        where: { id: ingredientId },
        data: { stockQty: nextStock },
      });

      const log = await tx.inventoryTransaction.create({
        data: {
          ingredientId,
          type,
          quantity: txQty,
          reason: reason ?? null,
        },
      });

      return { ingredient: updated, transaction: log };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        ingredient: result.ingredient,
        transaction: result.transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to adjust inventory" },
      { status: 500 }
    );
  }
}
