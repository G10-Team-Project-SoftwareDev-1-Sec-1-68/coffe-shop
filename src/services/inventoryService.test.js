// Context: Unit testing for Inventory Deduction based on BOM
// Feature: INV-01, TC-22, TC-26

import { describe, it, expect } from "vitest";
import {
  getRequiredIngredients,
  checkStock,
  deductStock,
  aggregateRequiredIngredients,
} from "@/services/inventoryService";

describe("Inventory Deduction Logic", () => {
  // Scenario: Calculate required ingredients for a specific product variant
  describe("Required ingredients for product variant", () => {
    it("returns BOM for single quantity", () => {
      const req = getRequiredIngredients("espresso", 1);
      expect(req).toEqual(
        expect.arrayContaining([
          { ingredientId: "beans", amount: 20, unit: "g" },
          { ingredientId: "water", amount: 60, unit: "ml" },
        ])
      );
    });

    it("multiplies by quantity (e.g. 2 espressos)", () => {
      const req = getRequiredIngredients("espresso", 2);
      expect(req.find((r) => r.ingredientId === "beans").amount).toBe(40);
      expect(req.find((r) => r.ingredientId === "water").amount).toBe(120);
    });

    it("returns empty for unknown variant", () => {
      expect(getRequiredIngredients("unknown")).toEqual([]);
    });
  });

  // Scenario: Prevent order if any ingredient in BOM is below required amount
  describe("Prevent order when stock insufficient", () => {
    it("canFulfill is true when all stock >= required", () => {
      const required = [
        { ingredientId: "beans", amount: 20 },
        { ingredientId: "milk", amount: 150 },
      ];
      const stock = { beans: 100, milk: 200 };
      const result = checkStock(required, stock);
      expect(result.canFulfill).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it("canFulfill is false and missing listed when one ingredient low", () => {
      const required = [
        { ingredientId: "beans", amount: 50 },
        { ingredientId: "milk", amount: 200 },
      ];
      const stock = { beans: 100, milk: 100 };
      const result = checkStock(required, stock);
      expect(result.canFulfill).toBe(false);
      expect(result.missing).toContainEqual({
        ingredientId: "milk",
        required: 200,
        current: 100,
      });
    });

    it("missing includes all insufficient ingredients", () => {
      const required = [
        { ingredientId: "a", amount: 10 },
        { ingredientId: "b", amount: 20 },
      ];
      const stock = { a: 5, b: 5 };
      const result = checkStock(required, stock);
      expect(result.missing).toHaveLength(2);
    });
  });

  // Scenario: Deduct exact amount (e.g., 20g beans, 150ml milk) from current stock
  describe("Deduct exact amount from stock", () => {
    it("deducts required amounts and returns new stock", () => {
      const currentStock = { beans: 100, milk: 200 };
      const required = [
        { ingredientId: "beans", amount: 20 },
        { ingredientId: "milk", amount: 150 },
      ];
      const { newStock, transactions } = deductStock(currentStock, required);
      expect(newStock.beans).toBe(80);
      expect(newStock.milk).toBe(50);
      expect(transactions).toHaveLength(2);
      expect(transactions).toContainEqual({ ingredientId: "beans", amount: 20, type: "Out" });
      expect(transactions).toContainEqual({ ingredientId: "milk", amount: 150, type: "Out" });
    });

    it("does not go below zero", () => {
      const currentStock = { beans: 10 };
      const { newStock } = deductStock(currentStock, [{ ingredientId: "beans", amount: 20 }]);
      expect(newStock.beans).toBe(0);
    });
  });

  // Scenario: Log 'Out' transaction in inventory_transactions
  it("returns Out transactions for each ingredient deducted", () => {
    const { transactions } = deductStock(
      { a: 50 },
      [{ ingredientId: "a", amount: 10 }]
    );
    expect(transactions[0].type).toBe("Out");
    expect(transactions[0].amount).toBe(10);
  });

  describe("Aggregate required for multiple items", () => {
    it("sums same ingredient across variants", () => {
      const items = [
        { productVariantId: "espresso", quantity: 1 },
        { productVariantId: "espresso", quantity: 2 },
      ];
      const agg = aggregateRequiredIngredients(items);
      const beans = agg.find((a) => a.ingredientId === "beans");
      expect(beans.amount).toBe(60); // 20*1 + 20*2
    });
  });
});
