/**
 * Serialize Prisma Decimal fields for JSON responses.
 * @param {object | null | undefined} order
 */
export function serializeOrder(order) {
  if (!order) return order;
  return {
    ...order,
    totalAmount: order.totalAmount != null ? String(order.totalAmount) : null,
    items: (order.items ?? []).map((it) => ({
      ...it,
      priceAtTime: it.priceAtTime != null ? String(it.priceAtTime) : null,
      variant: it.variant
        ? {
            ...it.variant,
            price: it.variant.price != null ? String(it.variant.price) : null,
            memberPrice:
              it.variant.memberPrice != null
                ? String(it.variant.memberPrice)
                : null,
          }
        : it.variant,
    })),
    payment: order.payment
      ? {
          ...order.payment,
          amount: order.payment.amount != null ? String(order.payment.amount) : null,
        }
      : null,
  };
}
