// Context: Unit testing for Order Scheduling
// Feature: CUS-02, TC-15

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isWithinOperatingHours,
  isPast,
  hasLeadTime,
  isHolidayOrClosure,
  validatePickupTime,
} from "@/lib/date-utils";

describe("Order Scheduling Logic", () => {
  // Scenario: Validate if selected time is within store operating hours (e.g., 07:00-18:00)
  describe("Operating hours (07:00-18:00)", () => {
    it("returns true for time inside 07:00-18:00", () => {
      const date = new Date("2025-06-15T10:00:00");
      expect(isWithinOperatingHours(date)).toBe(true);
    });

    it("returns false before 07:00", () => {
      const date = new Date("2025-06-15T06:30:00");
      expect(isWithinOperatingHours(date)).toBe(false);
    });

    it("returns false at or after 18:00", () => {
      expect(isWithinOperatingHours(new Date("2025-06-15T18:00:00"))).toBe(false);
      expect(isWithinOperatingHours(new Date("2025-06-15T19:00:00"))).toBe(false);
    });

    it("accepts custom open/close", () => {
      const date = new Date("2025-06-15T08:00:00");
      expect(
        isWithinOperatingHours(date, { hour: 9, minute: 0 }, { hour: 17, minute: 0 })
      ).toBe(false);
      expect(
        isWithinOperatingHours(date, { hour: 7, minute: 0 }, { hour: 22, minute: 0 })
      ).toBe(true);
    });
  });

  // Scenario: Block selection of past time/date
  describe("Block past time/date", () => {
    it("returns true for past date", () => {
      const past = new Date(Date.now() - 86400000);
      expect(isPast(past)).toBe(true);
    });

    it("returns false for future date", () => {
      const future = new Date(Date.now() + 86400000);
      expect(isPast(future)).toBe(false);
    });
  });

  // Scenario: Lead time (e.g., must order at least 15 minutes in advance)
  describe("Lead time (15 min in advance)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns false if pickup is within 15 minutes", () => {
      vi.setSystemTime(new Date("2025-06-15T12:00:00"));
      const pickup = new Date("2025-06-15T12:10:00"); // 10 min later
      expect(hasLeadTime(pickup, 15)).toBe(false);
    });

    it("returns true if pickup is 15+ minutes later", () => {
      vi.setSystemTime(new Date("2025-06-15T12:00:00"));
      const pickup = new Date("2025-06-15T12:20:00");
      expect(hasLeadTime(pickup, 15)).toBe(true);
    });

    it("respects custom lead minutes", () => {
      vi.setSystemTime(new Date("2025-06-15T12:00:00"));
      const pickup = new Date("2025-06-15T12:10:00");
      expect(hasLeadTime(pickup, 5)).toBe(true);
      expect(hasLeadTime(pickup, 30)).toBe(false);
    });
  });

  // Scenario: Handle holiday or store closure dates
  describe("Holiday / store closure", () => {
    it("returns true when date is in holiday list", () => {
      const date = new Date("2025-12-31T10:00:00");
      expect(isHolidayOrClosure(date, ["2025-12-31", "2026-01-01"])).toBe(true);
    });

    it("returns false when date is not in list", () => {
      const date = new Date("2025-06-15T10:00:00");
      expect(isHolidayOrClosure(date, ["2025-12-31"])).toBe(false);
    });

    it("returns false for empty holiday list", () => {
      expect(isHolidayOrClosure(new Date(), [])).toBe(false);
    });
  });

  describe("validatePickupTime (full validation)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00"));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns invalid reason 'past' for past time", () => {
      const past = new Date("2025-06-14T10:00:00");
      expect(validatePickupTime(past)).toEqual({ valid: false, reason: "past" });
    });

    it("returns invalid reason 'holiday_or_closure' on holiday", () => {
      const day = new Date("2025-06-16T14:00:00");
      expect(validatePickupTime(day, { holidays: ["2025-06-16"] })).toEqual({
        valid: false,
        reason: "holiday_or_closure",
      });
    });

    it("returns invalid reason 'lead_time' when too soon", () => {
      const soon = new Date("2025-06-15T12:05:00");
      expect(validatePickupTime(soon)).toEqual({ valid: false, reason: "lead_time" });
    });

    it("returns invalid reason 'outside_hours' when before open", () => {
      const early = new Date("2025-06-16T05:00:00");
      expect(validatePickupTime(early)).toEqual({ valid: false, reason: "outside_hours" });
    });

    it("returns valid for future time within hours and lead time", () => {
      const ok = new Date("2025-06-15T14:00:00");
      expect(validatePickupTime(ok)).toEqual({ valid: true });
    });
  });
});
