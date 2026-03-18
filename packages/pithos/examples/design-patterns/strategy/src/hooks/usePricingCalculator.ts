import { useState, useMemo, useCallback } from "react";
import { pricingStrategies } from "@/lib/strategies";
import { INITIAL_PRODUCTS } from "@/data/products";
import type { PricingStrategyKey, Product } from "@/lib/types";

export function usePricingCalculator() {
  const [strategy, setStrategy] = useState<PricingStrategyKey>("regular");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const result = useMemo(
    () => pricingStrategies.execute(strategy, { products }),
    [strategy, products],
  );

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, quantity: Math.max(0, quantity) } : p)),
    );
  }, []);

  return { strategy, setStrategy, products, result, updateQuantity };
}
