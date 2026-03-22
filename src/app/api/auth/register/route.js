import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
});

function buildUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phone: user.phone,
    points: user.points,
    memberTier: user.memberTier,
    preferredLang: user.preferredLang,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const { password, firstName, lastName, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    if (phone) {
      const phoneTaken = await prisma.user.findUnique({
        where: { phone },
      });
      if (phoneTaken) {
        return NextResponse.json({ error: "Phone already in use" }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName: lastName ?? null,
        phone: phone ?? null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        points: true,
        memberTier: true,
        preferredLang: true,
        isActive: true,
        createdAt: true,
      },
    });

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json(
      { token, user: buildUserPayload(user) },
      { status: 201 }
    );
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email or phone already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to register" },
      { status: 500 }
    );
  }
}
