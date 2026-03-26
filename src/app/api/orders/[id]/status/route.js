import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";
import { serializeOrder } from "@/lib/serialize-order";

const PatchStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
});

/**
 * PATCH /api/orders/[id]/status
 * STAFF/ADMIN: update status. When transitioning to COMPLETED, run BOM deduction in one transaction.
 */
export async function PATCH(request, context) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  const orderId = params?.id;
  if (!orderId || !z.string().uuid().safeParse(orderId).success) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = PatchStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newStatus = parsed.data.status;

    const order = await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE
        `;

        const existing = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: true,
            payment: true,
          },
        });

        if (!existing) {
          const err = new Error("Order not found");
          err.code = "NOT_FOUND";
          throw err;
        }

        const includeFull = {
          items: { include: { variant: { include: { product: true } } } },
          payment: true,
        };

        if (existing.status === newStatus) {
          return tx.order.findUnique({
            where: { id: orderId },
            include: includeFull,
          });
        }

        if (newStatus !== "COMPLETED") {
          await tx.order.update({
            where: { id: orderId },
            data: { status: newStatus },
          });
          return tx.order.findUnique({
            where: { id: orderId },
            include: includeFull,
          });
        }

        for (const item of existing.items) {
          // A. Deduct Variant Recipes
          const variantRecipes = await tx.recipe.findMany({
            where: { variantId: item.variantId },
          });

          // B. Deduct Option Recipes (if any)
          let optionRecipes = [];
          const opts = item.options && typeof item.options === 'object' ? item.options : {};
          const selectedOptionIds = opts.optionIds || [];
          
          if (selectedOptionIds.length > 0) {
            optionRecipes = await tx.recipe.findMany({
              where: { productOptionId: { in: selectedOptionIds } },
            });
          }

          const allRecipes = [...variantRecipes, ...optionRecipes];

          for (const rec of allRecipes) {
            const deduct = rec.quantity * item.quantity;
            const updated = await tx.ingredient.updateMany({
              where: {
                id: rec.ingredientId,
                stockQty: { gte: deduct },
              },
              data: {
                stockQty: { decrement: deduct },
              },
            });

            if (updated.count !== 1) {
              const err = new Error(`Insufficient stock for ingredient ${rec.ingredientId}`);
              err.code = "INSUFFICIENT_STOCK";
              err.ingredientId = rec.ingredientId;
              throw err;
            }

            await tx.inventoryTransaction.create({
              data: {
                ingredientId: rec.ingredientId,
                type: "SALE",
                quantity: -deduct,
                reason: `Order ${existing.orderNumber}`,
              },
            });
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: { status: "COMPLETED" },
        });

        // ==========================================
        // C. Loyalty Points Awarding (10 THB = 1 Point)
        // ==========================================
        if (existing.customerId) {
          const totalAmount = parseFloat(existing.totalAmount || 0);
          const pointsToAward = Math.floor(totalAmount / 10);
          
          if (pointsToAward > 0) {
            await tx.user.update({
              where: { id: existing.customerId },
              data: {
                points: { increment: pointsToAward }
              }
            });

            await tx.pointLog.create({
              data: {
                userId: existing.customerId,
                amount: pointsToAward,
                reason: `ได้รับแต้มจากการสั่งซื้อออเดอร์ ${existing.orderNumber}`,
                orderId: existing.id
              }
            });
          }
        }

        return tx.order.findUnique({
          where: { id: orderId },
          include: includeFull,
        });
      },
      { timeout: 30_000 }
    );

    return NextResponse.json({
      order: serializeOrder(order),
    });
  } catch (error) {
    if (error?.code === "NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (error?.code === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        {
          error: "Insufficient stock for one or more ingredients",
          ingredientId: error.ingredientId,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to update order status" },
      { status: 500 }
    );
  }
}
