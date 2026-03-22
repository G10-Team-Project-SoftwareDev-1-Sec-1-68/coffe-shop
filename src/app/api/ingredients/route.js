import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
