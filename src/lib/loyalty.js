/**
 * Membership Points & Tiers
 * Feature: MEM-01, TC-28, TC-29
 * - Points earned (e.g. 10 THB = 1 point)
 * - Update accumulated points
 * - Tier upgrade (Bronze -> Silver -> Gold) by spend threshold
 * - Redemption: cannot redeem more than available
 */

const DEFAULT_THB_PER_POINT = 10;
const DEFAULT_TIERS = [
  { id: "bronze", minSpend: 0, label: "Bronze" },
  { id: "silver", minSpend: 5000, label: "Silver" },
  { id: "gold", minSpend: 15000, label: "Gold" },
];

/**
 * @param {number} amountThb
 * @param {number} thbPerPoint
 * @returns {number}
 */
export function calculatePointsEarned(amountThb, thbPerPoint = DEFAULT_THB_PER_POINT) {
  return Math.floor(amountThb / thbPerPoint);
}

/**
 * @param {number} currentPoints
 * @param {number} earned
 * @returns {number}
 */
export function updateAccumulatedPoints(currentPoints, earned) {
  return currentPoints + earned;
}

/**
 * @param {number} totalSpend
 * @param {{ id: string; minSpend: number; label: string }[]} tiers
 * @returns {{ id: string; minSpend: number; label: string }}
 */
export function getTierForSpend(totalSpend, tiers = DEFAULT_TIERS) {
  const sorted = [...tiers].sort((a, b) => b.minSpend - a.minSpend);
  for (const tier of sorted) {
    if (totalSpend >= tier.minSpend) return tier;
  }
  return sorted[sorted.length - 1];
}

/**
 * @param {number} availablePoints
 * @param {number} redeemAmount
 * @returns {{ allowed: boolean; reason?: string }}
 */
export function validateRedemption(availablePoints, redeemAmount) {
  if (redeemAmount <= 0) {
    return { allowed: false, reason: "invalid_amount" };
  }
  if (redeemAmount > availablePoints) {
    return { allowed: false, reason: "insufficient_points" };
  }
  return { allowed: true };
}

/**
 * Apply redemption: new balance
 * @param {number} currentPoints
 * @param {number} redeemAmount
 * @returns {number}
 */
export function redeemPoints(currentPoints, redeemAmount) {
  const { allowed } = validateRedemption(currentPoints, redeemAmount);
  if (!allowed) return currentPoints;
  return currentPoints - redeemAmount;
}
