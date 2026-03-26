import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/** Schema / POS: cash, QR, card (matches common checkout flows) */
const PaymentMethodEnum = z.enum(["CASH", "QR_CODE", "CREDIT_CARD"]);

const CreatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: PaymentMethodEnum,
  amount: z.union([z.number(), z.string()]),
  pointsUsed: z.number().int().nonnegative().optional().nullable(),
});

function serializePayment(p) {
  if (!p) return p;
  return {
    ...p,
    amount: p.amount != null ? String(p.amount) : null,
  };
}

function sameMoney(a, b) {
  const x = Number(parseFloat(String(a)).toFixed(2));
  const y = Number(parseFloat(String(b)).toFixed(2));
  return Number.isFinite(x) && Number.isFinite(y) && x === y;
}

/**
 * POST /api/payments
 * Auth: create payment for an order (one payment per order).
 */
export async function POST(request) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = CreatePaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, method, amount, pointsUsed } = parsed.data;

    const payment = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order) {
        const err = new Error("Order not found");
        err.code = "ORDER_NOT_FOUND";
        throw err;
      }

      if (auth.payload.role === "CUSTOMER" && order.customerId !== auth.payload.sub) {
        const err = new Error("Forbidden");
        err.code = "FORBIDDEN_ORDER";
        throw err;
      }

      if (order.payment) {
        const err = new Error("Payment already exists for this order");
        err.code = "PAYMENT_EXISTS";
        throw err;
      }

      // STAFF/ADMIN ยืนยันเงินด้วยตนเองที่ POS ไม่ต้อง validate amount
      // CUSTOMER ต้องส่ง amount ตรงกับยอดจริงเสมอ
      const isStaffOrAdmin = auth.payload.role === "STAFF" || auth.payload.role === "ADMIN";
      if (!isStaffOrAdmin && !sameMoney(order.totalAmount, amount)) {
        const err = new Error("Amount must match order total");
        err.code = "AMOUNT_MISMATCH";
        throw err;
      }

      // In POS, if staff creates payment, they have verified it
      const isCompleted = method === "CASH" || method === "QR_CODE";
      const now = new Date();

      const created = await tx.payment.create({
        data: {
          orderId,
          method,
          amount: String(order.totalAmount),
          pointsUsed: pointsUsed ?? null,
          status: isCompleted ? "COMPLETED" : "PENDING",
          paidAt: isCompleted ? now : null,
        },
      });

      if (isCompleted && order.status === "PENDING") {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PREPARING" },
        });
      }

      return created;
    });

    return NextResponse.json(
      { payment: serializePayment(payment) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "ORDER_NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (error?.code === "FORBIDDEN_ORDER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error?.code === "PAYMENT_EXISTS") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error?.code === "AMOUNT_MISMATCH") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Payment already exists for this order" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create payment" },
      { status: 500 }
    );
  }
}
