import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

/**
 * GET /api/ingredients
 * Query: lowStock=true → stockQty <= minQty
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock");

    if (
      lowStock !== null &&
      lowStock !== "" &&
      lowStock !== "true" &&
      lowStock !== "false"
    ) {
      return NextResponse.json(
        { error: "lowStock must be true or false" },
        { status: 400 }
      );
    }

    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    const list =
      lowStock === "true"
        ? ingredients.filter((i) => i.stockQty <= i.minQty)
        : ingredients;

    return NextResponse.json({ ingredients: list });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

const CreateIngredientSchema = z.object({
  name: z.string().trim().min(1).max(100),
  stockQty: z.number().min(0).default(0),
  minQty: z.number().min(0).default(0),
  unit: z.string().trim().min(1).max(20),
});

/**
 * POST /api/ingredients
 * STAFF/ADMIN: add new ingredient type
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

    const parsed = CreateIngredientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, stockQty, minQty, unit } = parsed.data;

    // Check existing name
    const existing = await prisma.ingredient.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ingredient with this name already exists" },
        { status: 400 }
      );
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        stockQty,
        minQty,
        unit,
      },
    });

    return NextResponse.json({ ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create ingredient" },
      { status: 500 }
    );
  }
}
