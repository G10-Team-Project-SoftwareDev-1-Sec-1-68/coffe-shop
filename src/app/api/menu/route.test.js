import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/menu/route";

describe("GET /api/menu", () => {
  it("returns 200 with items array", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("items");
    expect(Array.isArray(data.items)).toBe(true);
  });
});

describe("POST /api/menu", () => {
  it("returns 400 when name is missing", async () => {
    const req = new Request("http://localhost/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 50 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("name and price are required");
  });

  it("returns 400 when price is missing", async () => {
    const req = new Request("http://localhost/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Espresso" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 and created item when name and price provided", async () => {
    const req = new Request("http://localhost/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Americano", price: 55, category: "coffee" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Americano");
    expect(data.price).toBe(55);
    expect(data.category).toBe("coffee");
    expect(data.id).toBeDefined();
  });
});
