import { NextResponse } from "next/server";

/**
 * GET /api/orders
 * Returns all orders (optionally filtered by query params).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // e.g. ?status=pending&userId=xxx
    // TODO: Replace with Prisma/Supabase
    const orders = [];
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create a new order.
 * Body: { items: [{ menuItemId, quantity }], note? }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { items, note } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items array is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma/Supabase
    const order = {
      id: crypto.randomUUID(),
      items,
      note: note ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create order" },
      { status: 500 }
    );
  }
}
