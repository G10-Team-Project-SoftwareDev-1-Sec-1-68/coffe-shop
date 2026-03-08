// Context: Unit testing for Loyalty System
// Feature: MEM-01, TC-28, TC-29

import { describe, it, expect } from "vitest";
import {
  calculatePointsEarned,
  updateAccumulatedPoints,
  getTierForSpend,
  validateRedemption,
  redeemPoints,
} from "@/lib/loyalty";

describe("Membership Logic", () => {
  // Scenario: Calculate points earned (e.g., 10 THB = 1 Point)
  describe("Points earned (10 THB = 1 Point)", () => {
    it("returns 1 point for 10 THB", () => {
      expect(calculatePointsEarned(10)).toBe(1);
    });

    it("returns 5 points for 55 THB", () => {
      expect(calculatePointsEarned(55)).toBe(5);
    });

    it("floors fractional points", () => {
      expect(calculatePointsEarned(99)).toBe(9);
    });

    it("respects custom thbPerPoint", () => {
      expect(calculatePointsEarned(100, 20)).toBe(5);
    });
  });

  // Scenario: Update total accumulated points in user profile
  describe("Update accumulated points", () => {
    it("adds earned to current", () => {
      expect(updateAccumulatedPoints(50, 10)).toBe(60);
    });

    it("handles zero earned", () => {
      expect(updateAccumulatedPoints(100, 0)).toBe(100);
    });
  });

  // Scenario: Trigger tier upgrade (e.g., Bronze -> Silver) when spend exceeds threshold
  describe("Tier upgrade by spend threshold", () => {
    it("returns Bronze for 0 spend", () => {
      expect(getTierForSpend(0).id).toBe("bronze");
    });

    it("returns Silver when spend >= 5000", () => {
      expect(getTierForSpend(5000).id).toBe("silver");
      expect(getTierForSpend(6000).id).toBe("silver");
    });

    it("returns Gold when spend >= 15000", () => {
      expect(getTierForSpend(15000).id).toBe("gold");
      expect(getTierForSpend(20000).id).toBe("gold");
    });

    it("returns Bronze when spend below 5000", () => {
      expect(getTierForSpend(4999).id).toBe("bronze");
    });
  });

  // Scenario: Point redemption validation (cannot redeem more than available)
  describe("Redemption validation", () => {
    it("allows redemption when points sufficient", () => {
      expect(validateRedemption(100, 50)).toEqual({ allowed: true });
      expect(validateRedemption(50, 50)).toEqual({ allowed: true });
    });

    it("disallows when redeem more than available", () => {
      const result = validateRedemption(30, 50);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("insufficient_points");
    });

    it("disallows invalid amount (zero or negative)", () => {
      expect(validateRedemption(100, 0).allowed).toBe(false);
      expect(validateRedemption(100, -10).allowed).toBe(false);
    });
  });

  describe("redeemPoints applies deduction only when allowed", () => {
    it("deducts when allowed", () => {
      expect(redeemPoints(100, 40)).toBe(60);
    });

    it("does not change balance when insufficient", () => {
      expect(redeemPoints(20, 50)).toBe(20);
    });
  });
});
