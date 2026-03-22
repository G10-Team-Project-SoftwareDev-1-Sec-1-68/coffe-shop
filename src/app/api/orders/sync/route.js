import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

const OrderStatusEnum = z.enum([
  "PENDING",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
]);

const OrderTypeEnum = z.enum(["ONLINE", "POS"]);

const OrderItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceAtTime: z.union([z.number(), z.string()]),
  options: z.any().optional().nullable(),
});

const PaymentMethodEnum = z.enum([
  "CASH",
  "QR_CODE",
  "CREDIT_CARD",
  "E_WALLET",
  "POINTS",
]);

const PaymentStatusEnum = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);

const SyncPaymentSchema = z.object({
  method: PaymentMethodEnum,
  status: PaymentStatusEnum,
  amount: z.union([z.number(), z.string()]),
  referenceNo: z.string().max(200).optional().nullable(),
  qrPayload: z.string().max(2000).optional().nullable(),
  slipUrl: z.string().max(2000).optional().nullable(),
  pointsUsed: z.number().int().optional().nullable(),
  paidAt: z.string().datetime().optional().nullable(),
});

const SyncOrderSchema = z.object({
  id: z.string().uuid().optional(),
  orderNumber: z.string().min(1).max(120),
  type: OrderTypeEnum,
  status: OrderStatusEnum.optional(),
  totalAmount: z.union([z.number(), z.string()]),
  customerId: z.string().uuid().optional().nullable(),
  staffId: z.string().uuid().optional().nullable(),
  promotionId: z.string().uuid().optional().nullable(),
  pickupMethod: z.enum(["SELF_PICKUP", "DELIVERY"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  deliveryAddress: z.string().max(2000).optional().nullable(),
  isOffline: z.boolean().optional().default(true),
  createdAt: z.string().datetime().optional(),
  items: z.array(OrderItemSchema).min(1),
  payment: SyncPaymentSchema,
});

const SyncBodySchema = z.object({
  orders: z.array(SyncOrderSchema).min(1),
});

/**
 * POST /api/orders/sync
 * STAFF/ADMIN: bulk insert offline POS orders in a single transaction.
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

    const parsed = SyncBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orders } = parsed.data;

    await prisma.$transaction(
      async (tx) => {
        for (const o of orders) {
          const variantIds = [...new Set(o.items.map((i) => i.variantId))];
          const variants = await tx.productVariant.findMany({
            where: { id: { in: variantIds } },
          });
          if (variants.length !== variantIds.length) {
            throw Object.assign(new Error("One or more variants not found"), {
              code: "VARIANT_NOT_FOUND",
            });
          }

          const now = new Date();
          const order = await tx.order.create({
            data: {
              ...(o.id ? { id: o.id } : {}),
              orderNumber: o.orderNumber,
              customerId: o.customerId ?? null,
              staffId: o.staffId ?? null,
              promotionId: o.promotionId ?? null,
              type: o.type,
              status: o.status ?? "PENDING",
              totalAmount: String(o.totalAmount),
              pickupMethod: o.pickupMethod ?? "SELF_PICKUP",
              scheduledAt: o.scheduledAt ? new Date(o.scheduledAt) : null,
              deliveryAddress: o.deliveryAddress ?? null,
              isOffline: o.isOffline ?? true,
              syncedAt: now,
              ...(o.createdAt ? { createdAt: new Date(o.createdAt) } : {}),
            },
          });

          await tx.orderItem.createMany({
            data: o.items.map((it) => ({
              orderId: order.id,
              variantId: it.variantId,
              quantity: it.quantity,
              priceAtTime: String(it.priceAtTime),
              ...(it.options != null ? { options: it.options } : {}),
            })),
          });

          await tx.payment.create({
            data: {
              orderId: order.id,
              method: o.payment.method,
              status: o.payment.status,
              amount: String(o.payment.amount),
              referenceNo: o.payment.referenceNo ?? null,
              qrPayload: o.payment.qrPayload ?? null,
              slipUrl: o.payment.slipUrl ?? null,
              pointsUsed: o.payment.pointsUsed ?? null,
              paidAt: o.payment.paidAt ? new Date(o.payment.paidAt) : null,
            },
          });
        }
      },
      { timeout: 60_000 }
    );

    return NextResponse.json({
      success: true,
      syncedCount: orders.length,
    });
  } catch (error) {
    if (error?.code === "VARIANT_NOT_FOUND") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate id or order number in sync payload or database" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to sync orders" },
      { status: 500 }
    );
  }
}
