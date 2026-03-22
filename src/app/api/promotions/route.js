import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

function serializePromotion(p) {
  if (!p) return p;
  return {
    ...p,
    discountValue: p.discountValue != null ? String(p.discountValue) : null,
    minOrderAmount:
      p.minOrderAmount != null ? String(p.minOrderAmount) : null,
  };
}

const CreatePromotionSchema = z
  .object({
    code: z.string().trim().min(1).max(64),
    description: z.string().trim().max(500).optional().nullable(),
    discountValue: z.union([z.number(), z.string()]),
    isPercent: z.boolean(),
    minOrderAmount: z.union([z.number(), z.string()]).optional().nullable(),
    maxUses: z.number().int().positive().optional().nullable(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

/**
 * GET /api/promotions
 * Public: active promotions where now is within [startDate, endDate].
 */
export async function GET() {
  try {
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({
      promotions: promotions.map(serializePromotion),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/promotions
 * STAFF/ADMIN: create promotion.
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

    const parsed = CreatePromotionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const promotion = await prisma.promotion.create({
      data: {
        code: d.code.toUpperCase(),
        description: d.description ?? null,
        discountValue: String(d.discountValue),
        isPercent: d.isPercent,
        minOrderAmount:
          d.minOrderAmount != null && d.minOrderAmount !== ""
            ? String(d.minOrderAmount)
            : null,
        maxUses: d.maxUses ?? null,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        isActive: true,
      },
    });

    return NextResponse.json(
      { promotion: serializePromotion(promotion) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Promotion code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create promotion" },
      { status: 500 }
    );
  }
}
