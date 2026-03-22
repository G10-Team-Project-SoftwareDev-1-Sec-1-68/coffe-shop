import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const CreateStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  role: z.enum(["STAFF", "ADMIN"]),
});

const userPublicSelect = {
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
 * POST /api/users/staff
 * ADMIN only: create STAFF or ADMIN user.
 */
export async function POST(request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = CreateStaffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, phone, role } = parsed.data;
    const emailNorm = email.toLowerCase().trim();

    const existingEmail = await prisma.user.findUnique({
      where: { email: emailNorm },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone already in use" },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: emailNorm,
        password: passwordHash,
        firstName,
        lastName: lastName ?? null,
        phone: phone ?? null,
        role,
      },
      select: userPublicSelect,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email or phone already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create staff user" },
      { status: 500 }
    );
  }
}
