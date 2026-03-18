/**
 * Pricing strategies using Pithos Strategy pattern.
 *
 * This is the core of the Strategy pattern:
 * each discount rule is a standalone function, selected by key at runtime.
 * No interface, no concrete classes, no context — just functions in a record.
 */
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";
import type { PricingInput, PricingResult, Product } from "./types";

/** Calculate subtotal from products */
function calculateSubtotal(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.basePrice * p.quantity, 0);
}

/** Apply a discount percentage to a subtotal */
function applyDiscount(subtotal: number, percent: number): PricingResult {
  const discount = subtotal * (percent / 100);
  return {
    subtotal,
    discount,
    total: subtotal - discount,
    discountPercent: percent,
  };
}

export const pricingStrategies = createStrategies({
  /** Regular pricing — no discount */
  regular: ({ products }: PricingInput) =>
    applyDiscount(calculateSubtotal(products), 0),

  /** VIP pricing — 20% off everything */
  vip: ({ products }: PricingInput) =>
    applyDiscount(calculateSubtotal(products), 20),

  /** Promo pricing — 15% off */
  promo: ({ products }: PricingInput) =>
    applyDiscount(calculateSubtotal(products), 15),

  /** Bulk pricing — 25% off for orders over $300 */
  bulk: ({ products }: PricingInput) => {
    const subtotal = calculateSubtotal(products);
    return applyDiscount(subtotal, subtotal >= 300 ? 25 : 0);
  },
});
