/**
 * Inventory & BOM Logic (Bill of Materials)
 * Feature: INV-01, TC-22, TC-26
 * - Required ingredients per product variant
 * - Prevent order if ingredient below required
 * - Deduct stock and log 'Out' transaction
 */

/**
 * BOM: productVariantId -> [{ ingredientId, amount, unit }]
 * @type {Record<string, Array<{ ingredientId: string; amount: number; unit: string }>>}
 */
const DEFAULT_BOM = {
  espresso: [
    { ingredientId: "beans", amount: 20, unit: "g" },
    { ingredientId: "water", amount: 60, unit: "ml" },
  ],
  latte: [
    { ingredientId: "beans", amount: 18, unit: "g" },
    { ingredientId: "milk", amount: 150, unit: "ml" },
    { ingredientId: "water", amount: 30, unit: "ml" },
  ],
};

/**
 * @param {string} productVariantId
 * @param {number} quantity
 * @param {Record<string, Array<{ ingredientId: string; amount: number; unit: string }>>} [bom]
 * @returns {Array<{ ingredientId: string; amount: number; unit: string }>}
 */
export function getRequiredIngredients(productVariantId, quantity = 1, bom = DEFAULT_BOM) {
  const recipe = bom[productVariantId];
  if (!recipe) return [];
  return recipe.map((r) => ({
    ingredientId: r.ingredientId,
    amount: r.amount * quantity,
    unit: r.unit,
  }));
}

/**
 * @param {Array<{ ingredientId: string; amount: number }>} required
 * @param {Record<string, number>} currentStock stock by ingredientId
 * @returns {{ canFulfill: boolean; missing: Array<{ ingredientId: string; required: number; current: number }> }}
 */
export function checkStock(required, currentStock = {}) {
  const missing = [];
  for (const r of required) {
    const current = currentStock[r.ingredientId] ?? 0;
    if (current < r.amount) {
      missing.push({ ingredientId: r.ingredientId, required: r.amount, current });
    }
  }
  return { canFulfill: missing.length === 0, missing };
}

/**
 * @param {Record<string, number>} currentStock
 * @param {Array<{ ingredientId: string; amount: number }>} required
 * @returns {{ newStock: Record<string, number>; transactions: Array<{ ingredientId: string; amount: number; type: 'Out' }> }}
 */
export function deductStock(currentStock, required) {
  const newStock = { ...currentStock };
  const transactions = [];
  for (const r of required) {
    const before = newStock[r.ingredientId] ?? 0;
    newStock[r.ingredientId] = Math.max(0, before - r.amount);
    transactions.push({ ingredientId: r.ingredientId, amount: r.amount, type: "Out" });
  }
  return { newStock, transactions };
}

/**
 * Build full BOM requirement for an order (multiple items)
 * @param {Array<{ productVariantId: string; quantity: number }>} items
 * @param {Record<string, Array<{ ingredientId: string; amount: number; unit: string }>>} [bom]
 * @returns {Array<{ ingredientId: string; amount: number; unit: string }>} aggregated (same ingredient summed)
 */
export function aggregateRequiredIngredients(items, bom = DEFAULT_BOM) {
  const byId = {};
  for (const item of items) {
    const req = getRequiredIngredients(item.productVariantId, item.quantity, bom);
    for (const r of req) {
      byId[r.ingredientId] = (byId[r.ingredientId] ?? 0) + r.amount;
    }
  }
  return Object.entries(byId).map(([ingredientId, amount]) => ({
    ingredientId,
    amount,
    unit: "g",
  }));
}
