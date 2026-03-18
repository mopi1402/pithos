import type { Product, PricingStrategyKey } from "@/lib/types";

/** Initial shopping cart — Martins bestsellers */
export const INITIAL_PRODUCTS: Product[] = [
  { name: "Double Serum", basePrice: 89.00, quantity: 1, image: "double-serum.png" },
  { name: "Hydra-Essentiel Cream", basePrice: 52.00, quantity: 1, image: "hydra-essentiel.png" },
  { name: "Lip Comfort Oil", basePrice: 28.00, quantity: 2, image: "lip-comfort-oil.png" },
];

/** Strategy metadata for UI display */
export const STRATEGY_INFO: Record<
  PricingStrategyKey,
  { label: string; description: string }
> = {
  regular: {
    label: "Standard",
    description: "Full price, no discount",
  },
  vip: {
    label: "Club Martins",
    description: "20% loyalty reward",
  },
  promo: {
    label: "Seasonal Offer",
    description: "15% limited-time discount",
  },
  bulk: {
    label: "Coffret",
    description: "25% off orders over $300",
  },
};
