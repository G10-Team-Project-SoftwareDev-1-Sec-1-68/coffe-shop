import { NextResponse } from "next/server";

/**
 * GET /api/menu
 * Returns all menu items.
 */
export async function GET() {
  try {
    // TODO: Replace with Prisma/Supabase, e.g.:
    // const items = await prisma.menuItem.findMany();
    const items = [];
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu
 * Create a new menu item.
 * Body: { name, price, category?, description? }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, description } = body;

    if (!name || price == null) {
      return NextResponse.json(
        { error: "name and price are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma/Supabase, e.g.:
    // const item = await prisma.menuItem.create({ data: { name, price, category, description } });
    const item = {
      id: crypto.randomUUID(),
      name,
      price: Number(price),
      category: category ?? null,
      description: description ?? null,
    };

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create menu item" },
      { status: 500 }
    );
  }
}
