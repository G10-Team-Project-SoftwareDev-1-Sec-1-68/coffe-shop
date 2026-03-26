import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize-order";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/orders/[id]
 */
export async function GET(request, { params }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
        payment: true,
        customer: { select: { firstName: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * Update status and handle stock deduction if moving to COMPLETED.
 */
export async function PUT(request, { params }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  // Only STAFF/ADMIN can update order status
  if (auth.payload.role === "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Get current order state
      const currentOrder = await tx.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              variant: {
                include: { recipes: true }
              }
            }
          }
        }
      });

      if (!currentOrder) throw new Error("Order not found");

      // 2. Handle Stock Deduction if status is moving to COMPLETED
      if (status === "COMPLETED" && currentOrder.status !== "COMPLETED") {
        console.log(`📌 Deducting stock for Order ${currentOrder.orderNumber}`);
        
        for (const item of currentOrder.items) {
          const recipes = item.variant.recipes || [];
          for (const recipe of recipes) {
            const totalDeduct = recipe.quantity * item.quantity;
            
            // Decrement Stock
            await tx.ingredient.update({
              where: { id: recipe.ingredientId },
              data: {
                stockQty: { decrement: totalDeduct }
              }
            });

            // Log Transaction
            await tx.inventoryTransaction.create({
              data: {
                ingredientId: recipe.ingredientId,
                type: "SALE",
                quantity: -totalDeduct,
                reason: `Sale from Order ${currentOrder.orderNumber}`
              }
            });
          }
        }
      }

      // 3. Update Order Status
      return tx.order.update({
        where: { id },
        data: { status },
        include: {
          items: { include: { variant: { include: { product: true } } } },
          payment: true
        }
      });
    });

    return NextResponse.json({ order: serializeOrder(updatedOrder) });
  } catch (error) {
    console.error("PUT /api/orders/[id] Error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to update order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id]
 */
export async function DELETE(request, { params }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    // Check if STAFF or the customer who owns the order
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    if (auth.payload.role === "CUSTOMER" && order.customerId !== auth.payload.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to delete order" },
      { status: 500 }
    );
  }
}
