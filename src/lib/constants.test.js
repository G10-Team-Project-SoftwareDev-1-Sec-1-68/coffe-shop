import { describe, it, expect } from "vitest";
import { PROTECTED_PATHS } from "@/lib/constants";

describe("constants", () => {
  it("PROTECTED_PATHS contains /menu and /order", () => {
    expect(PROTECTED_PATHS).toContain("/menu");
    expect(PROTECTED_PATHS).toContain("/order");
  });

  it("PROTECTED_PATHS is an array", () => {
    expect(Array.isArray(PROTECTED_PATHS)).toBe(true);
  });

  it("all entries are strings starting with /", () => {
    PROTECTED_PATHS.forEach((path) => {
      expect(typeof path).toBe("string");
      expect(path.startsWith("/")).toBe(true);
    });
  });
});
