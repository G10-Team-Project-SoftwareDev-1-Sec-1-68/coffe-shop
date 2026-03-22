import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Public: list all categories ordered by sortOrder.
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
