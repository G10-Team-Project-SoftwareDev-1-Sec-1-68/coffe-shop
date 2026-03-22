import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

/** Query filter: `?role=CUSTOMER` or `?role=STAFF` (omit for all roles). */
const RoleFilterEnum = z.enum(["CUSTOMER", "STAFF"]);

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  points: true,
  memberTier: true,
  preferredLang: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * GET /api/users
 * STAFF/ADMIN: list users (no passwords). Optional ?role=CUSTOMER|STAFF
 */
export async function GET(request) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const roleRaw = searchParams.get("role");

    if (roleRaw && !RoleFilterEnum.safeParse(roleRaw).success) {
      return NextResponse.json(
        { error: "Invalid role filter (use CUSTOMER or STAFF)" },
        { status: 400 }
      );
    }

    const where = {};
    if (roleRaw) {
      where.role = roleRaw;
    }

    const users = await prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch users" },
      { status: 500 }
    );
  }
}
