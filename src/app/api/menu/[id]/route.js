import { NextResponse } from "next/server";

/**
 * GET /api/menu/[id]
 * Returns a single menu item by id.
 */
export async function GET(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // TODO: Replace with Prisma/Supabase, e.g.:
    // const item = await prisma.menuItem.findUnique({ where: { id } });
    const item = null;

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/menu/[id]
 * Update a menu item.
 * Body: { name?, price?, category?, description? }
 */
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const body = await request.json();

    // TODO: Replace with Prisma/Supabase, e.g.:
    // const item = await prisma.menuItem.update({ where: { id }, data: body });
    const item = { id, ...body };

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to update menu item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/menu/[id]
 * Delete a menu item.
 */
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // TODO: Replace with Prisma/Supabase, e.g.:
    // await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
