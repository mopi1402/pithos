/** Product with base price */
export interface Product {
  name: string;
  basePrice: number;
  quantity: number;
  image?: string;
}

/** Pricing result with breakdown */
export interface PricingResult {
  subtotal: number;
  discount: number;
  total: number;
  discountPercent: number;
}

/** Input for pricing calculation */
export interface PricingInput {
  products: Product[];
}

/** Strategy key type for type-safe selection */
export type PricingStrategyKey = "regular" | "vip" | "promo" | "bulk";
