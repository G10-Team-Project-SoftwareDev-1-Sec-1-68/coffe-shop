import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

const PatchPaymentStatusSchema = z.object({
  status: z.enum(["COMPLETED", "FAILED"]),
});

function serializePayment(p) {
  if (!p) return p;
  return {
    ...p,
    amount: p.amount != null ? String(p.amount) : null,
  };
}

/**
 * PATCH /api/payments/[id]/status
 * STAFF/ADMIN: update payment status; if COMPLETED, move order PENDING → PREPARING.
 */
export async function PATCH(request, context) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  const params = await context.params;
  const paymentId = params?.id;
  if (!paymentId || !z.string().uuid().safeParse(paymentId).success) {
    return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = PatchPaymentStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newStatus = parsed.data.status;

    const result = await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT id FROM "Payment" WHERE id = ${paymentId} FOR UPDATE
        `;

        const payment = await tx.payment.findUnique({
          where: { id: paymentId },
          include: { order: true },
        });

        if (!payment) {
          const err = new Error("Payment not found");
          err.code = "NOT_FOUND";
          throw err;
        }

        if (payment.status === newStatus) {
          return tx.payment.findUnique({
            where: { id: paymentId },
            include: { order: true },
          });
        }

        const now = new Date();
        const updated = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: newStatus,
            paidAt: newStatus === "COMPLETED" ? now : null,
          },
        });

        if (newStatus === "COMPLETED" && payment.order.status === "PENDING") {
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: "PREPARING" },
          });
        }

        return tx.payment.findUnique({
          where: { id: updated.id },
          include: { order: true },
        });
      },
      { timeout: 15_000 }
    );

    return NextResponse.json({
      payment: serializePayment(result),
      order: result.order
        ? {
            id: result.order.id,
            orderNumber: result.order.orderNumber,
            status: result.order.status,
          }
        : null,
    });
  } catch (error) {
    if (error?.code === "NOT_FOUND") {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to update payment status" },
      { status: 500 }
    );
  }
}
