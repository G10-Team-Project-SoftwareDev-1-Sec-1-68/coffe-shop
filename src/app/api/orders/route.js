import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeOrder } from "@/lib/serialize-order";

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

const CreateOrderSchema = z.object({
  type: OrderTypeEnum,
  totalAmount: z.union([z.number(), z.string()]),
  items: z.array(OrderItemSchema).min(1),
  pickupMethod: z.enum(["SELF_PICKUP", "DELIVERY"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  deliveryAddress: z.string().max(2000).optional().nullable(),
  /** STAFF/ADMIN only: link order to a customer */
  customerId: z.string().uuid().optional().nullable(),
});

function generateOrderNumber() {
  return `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * GET /api/orders
 * CUSTOMER: own orders only. STAFF/ADMIN: all orders.
 * Query: ?status=PENDING
 */
export async function GET(request) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const statusRaw = searchParams.get("status");

    if (statusRaw && !OrderStatusEnum.safeParse(statusRaw).success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    /** @type {Record<string, unknown>} */
    const where = {};
    if (auth.payload.role === "CUSTOMER") {
      where.customerId = auth.payload.sub;
    }
    if (statusRaw) {
      where.status = statusRaw;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((o) => serializeOrder(o)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create order + items in one transaction. CUSTOMER: ONLINE only. STAFF/ADMIN: ONLINE or POS.
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

    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { type, totalAmount, items, pickupMethod, scheduledAt, deliveryAddress } =
      data;

    if (auth.payload.role === "CUSTOMER") {
      if (type !== "ONLINE") {
        return NextResponse.json(
          { error: "Customers may only create ONLINE orders" },
          { status: 403 }
        );
      }
    }

    let customerId = null;
    let staffId = null;
    if (auth.payload.role === "CUSTOMER") {
      customerId = auth.payload.sub;
    } else {
      staffId = auth.payload.sub;
      customerId = data.customerId ?? null;
    }

    const created = await prisma.$transaction(async (tx) => {
      const variantIds = [...new Set(items.map((i) => i.variantId))];
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
      });
      if (variants.length !== variantIds.length) {
        throw Object.assign(new Error("One or more variants not found"), {
          code: "VARIANT_NOT_FOUND",
        });
      }

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId,
          staffId,
          type,
          status: "PENDING",
          totalAmount: String(totalAmount),
          pickupMethod: pickupMethod ?? "SELF_PICKUP",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          deliveryAddress: deliveryAddress ?? null,
          isOffline: false,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((it) => ({
          orderId: order.id,
          variantId: it.variantId,
          quantity: it.quantity,
          priceAtTime: String(it.priceAtTime),
          options:
            it.options === undefined || it.options === null
              ? undefined
              : it.options,
        })),
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { variant: { include: { product: true } } } },
          payment: true,
        },
      });
    });

    return NextResponse.json(
      { order: serializeOrder(created) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "VARIANT_NOT_FOUND") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate order number or constraint violation" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create order" },
      { status: 500 }
    );
  }
}
