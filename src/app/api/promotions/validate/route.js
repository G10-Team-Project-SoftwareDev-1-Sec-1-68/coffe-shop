import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const ValidateSchema = z.object({
  code: z.string().trim().min(1).max(64),
  orderTotalAmount: z.union([z.number(), z.string()]),
});

function toNumber(v) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Calculate discount for an order total (caps at order total).
 */
function computeDiscountAmount(promotion, orderTotal) {
  const dv = toNumber(promotion.discountValue);
  if (!Number.isFinite(dv) || !Number.isFinite(orderTotal)) return null;

  if (promotion.isPercent) {
    const pct = Math.min(100, Math.max(0, dv));
    const raw = (orderTotal * pct) / 100;
    return Math.min(raw, orderTotal);
  }

  return Math.min(dv, orderTotal);
}

/**
 * POST /api/promotions/validate
 * Auth: check promo code and return discount amount.
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

    const parsed = ValidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code } = parsed.data;
    const orderTotal = toNumber(parsed.data.orderTotalAmount);
    if (!Number.isFinite(orderTotal) || orderTotal < 0) {
      return NextResponse.json(
        { error: "orderTotalAmount must be a non-negative number" },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      return NextResponse.json({
        valid: false,
        reason: "Promotion code not found",
      });
    }

    const now = new Date();
    if (!promotion.isActive) {
      return NextResponse.json({
        valid: false,
        reason: "Promotion is not active",
      });
    }

    if (now < promotion.startDate || now > promotion.endDate) {
      return NextResponse.json({
        valid: false,
        reason: "Promotion is outside the valid date range",
      });
    }

    if (
      promotion.maxUses != null &&
      promotion.usedCount >= promotion.maxUses
    ) {
      return NextResponse.json({
        valid: false,
        reason: "Promotion usage limit reached",
      });
    }

    if (promotion.minOrderAmount != null) {
      const minAmt = toNumber(promotion.minOrderAmount);
      if (orderTotal < minAmt) {
        return NextResponse.json({
          valid: false,
          reason: "Order total is below the minimum for this promotion",
          minOrderAmount: String(promotion.minOrderAmount),
        });
      }
    }

    const discountAmount = computeDiscountAmount(promotion, orderTotal);
    if (discountAmount == null) {
      return NextResponse.json({
        valid: false,
        reason: "Could not calculate discount",
      });
    }

    return NextResponse.json({
      valid: true,
      promotionId: promotion.id,
      code: promotion.code,
      isPercent: promotion.isPercent,
      discountValue: String(promotion.discountValue),
      discountAmount: discountAmount.toFixed(2),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to validate promotion" },
      { status: 500 }
    );
  }
}
