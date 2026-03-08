// Context: Unit testing for price calculation logic
// Feature: MNU-02, MNU-03, TC-01, TC-02

import { describe, it, expect } from "vitest";
import {
  calculateSubtotal,
  applyMemberDiscount,
  applyPromotion,
  addVAT,
  calculateOrderTotal,
} from "@/lib/pricing";

describe("Pricing Engine", () => {
  // Scenario: Base product + Multiple options (Milk, Sweetness, Topping)
  describe("Base + Options", () => {
    it("calculates subtotal from base price only", () => {
      expect(calculateSubtotal(50, [])).toBe(50);
    });

    it("adds option prices (Milk, Sweetness, Topping)", () => {
      const options = [
        { name: "Milk", price: 10 },
        { name: "Sweetness", price: 5 },
        { name: "Topping", price: 15 },
      ];
      expect(calculateSubtotal(45, options)).toBe(75);
    });

    it("handles empty or missing options", () => {
      expect(calculateSubtotal(40, undefined)).toBe(40);
    });
  });

  // Scenario: Normal Price vs Member Price (Role-based)
  describe("Normal Price vs Member Price", () => {
    it("guest pays full price", () => {
      const result = applyMemberDiscount(100, "guest");
      expect(result.rolePrice).toBe(100);
    });

    it("member gets 10% off by default", () => {
      const result = applyMemberDiscount(100, "member");
      expect(result.rolePrice).toBe(90);
    });

    it("vip gets 15% off by default", () => {
      const result = applyMemberDiscount(100, "vip");
      expect(result.rolePrice).toBe(85);
    });

    it("respects custom member multiplier", () => {
      const result = applyMemberDiscount(100, "member", { member: 0.95 });
      expect(result.rolePrice).toBe(95);
    });
  });

  // Scenario: Promotion discount (Percentage & Fixed amount)
  describe("Promotion discount", () => {
    it("percentage discount reduces amount correctly", () => {
      const result = applyPromotion(100, { type: "percent", value: 20 });
      expect(result.discountAmount).toBe(20);
      expect(result.discounted).toBe(80);
    });

    it("fixed amount discount caps at amount", () => {
      const result = applyPromotion(50, { type: "fixed", value: 30 });
      expect(result.discountAmount).toBe(30);
      expect(result.discounted).toBe(20);
    });

    it("fixed discount does not exceed total", () => {
      const result = applyPromotion(25, { type: "fixed", value: 100 });
      expect(result.discountAmount).toBe(25);
      expect(result.discounted).toBe(0);
    });

    it("no promotion returns same amount", () => {
      const result = applyPromotion(100, null);
      expect(result.discounted).toBe(100);
      expect(result.discountAmount).toBe(0);
    });
  });

  // Scenario: Calculate total with tax (VAT 7%)
  describe("VAT 7%", () => {
    it("adds 7% VAT to amount", () => {
      const result = addVAT(100);
      expect(result.vatAmount).toBe(7);
      expect(result.total).toBe(107);
    });

    it("rounds to 2 decimal places", () => {
      const result = addVAT(33.33);
      expect(result.vatAmount).toBe(2.33);
      expect(result.total).toBe(35.66);
    });
  });

  describe("Full pipeline (base + options -> member -> promotion -> VAT)", () => {
    it("calculates total for guest with options", () => {
      const result = calculateOrderTotal({
        basePrice: 50,
        options: [{ name: "Milk", price: 10 }],
        role: "guest",
      });
      expect(result.subtotal).toBe(60);
      expect(result.afterMember).toBe(60);
      expect(result.afterPromo).toBe(60);
      expect(result.total).toBe(64.2);
      expect(result.vatAmount).toBe(4.2);
    });

    it("calculates total for member with promotion and VAT", () => {
      const result = calculateOrderTotal({
        basePrice: 100,
        options: [],
        role: "member",
        promotion: { type: "percent", value: 10 },
      });
      expect(result.subtotal).toBe(100);
      expect(result.afterMember).toBe(90);
      expect(result.afterPromo).toBe(81);
      expect(result.vatAmount).toBe(5.67);
      expect(result.total).toBe(86.67);
    });
  });
});
