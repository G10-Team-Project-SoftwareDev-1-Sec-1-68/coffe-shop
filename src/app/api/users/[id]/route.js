import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const UpdateRoleSchema = z.object({
  role: z.enum(["CUSTOMER", "STAFF", "ADMIN"]),
});

const userPublicSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
};

/**
 * PUT /api/users/[id]
 * ADMIN only: update user role or status
 */
export async function PUT(request, { params }) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    // Note: in Next 15, params is a promise but can be unwrapped safely 
    // depending on the exact implementation, we'll await it to be safe.
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = UpdateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { role } = parsed.data;

    // Prevent removing the last admin (optional but good idea if needed, we'll skip for simple implementation)
    // Prevent changing your own role
    if (userId === auth.payload.sub) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userPublicSelect,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to update user" },
      { status: 500 }
    );
  }
}
