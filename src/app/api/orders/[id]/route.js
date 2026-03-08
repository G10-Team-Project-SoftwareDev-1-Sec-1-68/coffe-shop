import { NextResponse } from "next/server";

/**
 * GET /api/orders/[id]
 * Returns a single order by id.
 */
export async function GET(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // TODO: Replace with Prisma/Supabase
    const order = null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * Update an order (e.g. status).
 * Body: { status?, items?, note? }
 */
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const body = await request.json();

    // TODO: Replace with Prisma/Supabase
    const order = { id, ...body };

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to update order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id]
 * Delete/cancel an order.
 */
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // TODO: Replace with Prisma/Supabase

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to delete order" },
      { status: 500 }
    );
  }
}
