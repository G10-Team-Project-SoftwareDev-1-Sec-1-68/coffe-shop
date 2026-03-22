import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/jwt", () => ({
  signToken: vi.fn().mockReturnValue("mock-jwt-token"),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    prisma.user.findUnique.mockReset();
    prisma.user.create.mockReset();
  });

  it("returns 400 when input is invalid", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", password: "short" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid input");
  });

  it("returns 400 when email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "test@example.com" });

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        firstName: "Existing",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Email already in use");
  });

  it("creates a user and returns 201 on valid data", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "u1",
      email: "new@example.com",
      firstName: "New",
      lastName: "User",
      role: "CUSTOMER",
      phone: null,
      points: 0,
      memberTier: "BRONZE",
      preferredLang: "th",
      isActive: true,
      createdAt: new Date(),
    });

    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "new@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty("user");
    expect(data).toHaveProperty("token");
    expect(data.user.email).toBe("new@example.com");
    expect(prisma.user.create).toHaveBeenCalled();
  });
});
