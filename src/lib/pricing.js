/**
 * POS Pricing & Discount Engine
 * Feature: MNU-02, MNU-03, TC-01, TC-02
 * - Base price + options (Milk, Sweetness, Topping)
 * - Normal vs Member price (role-based)
 * - Promotion: percentage & fixed amount
 * - Total with VAT 7%
 */

const VAT_RATE = 0.07;

/**
 * @param {number} basePrice
 * @param {Array<{ name: string; price: number }>} options
 * @returns {number} subtotal before discount
 */
export function calculateSubtotal(basePrice, options = []) {
  const optionsTotal = options.reduce((sum, opt) => sum + (opt.price ?? 0), 0);
  return basePrice + optionsTotal;
}

/**
 * @param {number} subtotal
 * @param {'guest'|'member'|'vip'} role
 * @param {Record<string, number>} memberMultiplier e.g. { member: 0.9, vip: 0.85 }
 * @returns {{ amount: number, rolePrice: number }}
 */
export function applyMemberDiscount(subtotal, role, memberMultiplier = { member: 0.9, vip: 0.85 }) {
  const multiplier = role === "guest" ? 1 : (memberMultiplier[role] ?? 1);
  const rolePrice = Math.round(subtotal * multiplier * 100) / 100;
  return { amount: rolePrice, rolePrice };
}

/**
 * @param {number} amount
 * @param {{ type: 'percent'|'fixed'; value: number }} promotion
 * @returns {{ discounted: number; discountAmount: number }}
 */
export function applyPromotion(amount, promotion) {
  if (!promotion) return { discounted: amount, discountAmount: 0 };
  const discountAmount =
    promotion.type === "percent"
      ? Math.round(amount * (promotion.value / 100) * 100) / 100
      : Math.min(promotion.value, amount);
  const discounted = Math.round((amount - discountAmount) * 100) / 100;
  return { discounted, discountAmount };
}

/**
 * @param {number} amountBeforeTax
 * @returns {{ total: number; vatAmount: number }}
 */
export function addVAT(amountBeforeTax) {
  const vatAmount = Math.round(amountBeforeTax * VAT_RATE * 100) / 100;
  const total = Math.round((amountBeforeTax + vatAmount) * 100) / 100;
  return { total, vatAmount };
}

/**
 * Full pipeline: base + options -> member discount -> promotion -> VAT
 * @param {{
 *   basePrice: number;
 *   options?: Array<{ name: string; price: number }>;
 *   role?: 'guest'|'member'|'vip';
 *   promotion?: { type: 'percent'|'fixed'; value: number };
 * }} params
 * @returns {{ subtotal: number; afterMember: number; afterPromo: number; vatAmount: number; total: number }}
 */
export function calculateOrderTotal(params) {
  const { basePrice, options = [], role = "guest", promotion } = params;
  const subtotal = calculateSubtotal(basePrice, options);
  const { rolePrice: afterMember } = applyMemberDiscount(subtotal, role);
  const { discounted: afterPromo } = applyPromotion(afterMember, promotion);
  const { total, vatAmount } = addVAT(afterPromo);
  return { subtotal, afterMember, afterPromo, vatAmount, total };
}
